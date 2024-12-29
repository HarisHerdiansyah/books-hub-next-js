/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { s3UploadHelper } from '@/service/aws';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const userSession = (await getServerSession(authOptions))?.user;

    if ('username' in body) {
      const isUsernameExist = (
        await db.users.findUnique({
          where: { username: body.username },
          select: { username: true },
        })
      )?.username;

      if (isUsernameExist) {
        return NextResponse.json(
          {
            success: false,
            message: 'Username is already in use',
          },
          { status: 409 }
        );
      }
    }

    await db.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: { username: userSession?.username },
      });

      if ('username' in body) {
        await tx.books.updateMany({
          where: { userId: user?.userId },
          data: { username: body.username },
        });

        await tx.accounts.update({
          where: { username: user?.username as string },
          data: { username: body.username },
        });
      }

      await tx.users.update({
        where: { userId: user?.userId },
        data: { ...body },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Success updating profile',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Edit profile error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating profile',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userObj = (await getServerSession(authOptions))?.user;

    const pathUpload = 'profile';
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    const image = body.photo as File;
    const fileKey = userObj?.id;

    const isUploadSuccess = await s3UploadHelper(
      image,
      fileKey as string,
      pathUpload
    );

    const ext = image.name.split('.').pop();
    const fileKeyWithExt = `${fileKey}.${ext}`;
    let imageUrl = '';
    if (isUploadSuccess) {
      // revalidate cache first
      imageUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${pathUpload}/${fileKeyWithExt}`;
    }

    await db.$transaction(async (tx) => {
      await tx.accounts.update({
        where: { username: userObj?.username as string },
        data: { firstLogin: false },
      });

      await tx.users.update({
        where: { userId: userObj?.id },
        data: {
          firstName: body.firstName as string,
          lastName: body.lastName as string,
          bio: body.bio as string,
          about: body.about as string,
          imageUrl,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Update profile success',
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Registration error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}
