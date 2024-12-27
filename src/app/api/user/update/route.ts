/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { uploadFile } from '@/service/aws';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userObj;
    if (session?.user) userObj = session.user;

    const pathUpload = 'profile';
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    const image = body.photo as File;
    const fileKey = userObj?.id;

    const isUploadSuccess = await uploadFile(
      image,
      fileKey as string,
      pathUpload
    );

    const ext = image.name.split('.').pop();
    const fileKeyWithExt = `${fileKey}.${ext}`;
    let imageUrl = '';
    if (isUploadSuccess) {
      imageUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${pathUpload}/${fileKeyWithExt}`;
    }

    await db.accounts.update({
      where: { username: userObj?.username as string },
      data: { firstLogin: false },
    });

    await db.users.update({
      where: { userId: userObj?.id },
      data: {
        firstName: body.firstName as string,
        lastName: body.lastName as string,
        bio: body.bio as string,
        about: body.about as string,
        imageUrl,
      },
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
