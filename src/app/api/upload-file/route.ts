/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { revalidateCloudFrontCache, s3UploadHelper } from '@/service/aws';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const fileData = await req.formData();
    const payload = Object.fromEntries(fileData.entries());
    const image = payload.photo as File;

    const userObj = (await getServerSession(authOptions))?.user;
    const fileKey = userObj?.id as string;
    const ext = image.name.split('.').pop();
    const fileKeyWithExt = `${fileKey}.${ext}`;
    const pathUpload = 'profile';

    console.log(fileKey, fileKeyWithExt);
    const isUploadSuccess = await s3UploadHelper(image, fileKey, pathUpload);
    const isRevalidateSuccess = await revalidateCloudFrontCache(
      pathUpload,
      fileKeyWithExt
    );

    let imageUrl = '';
    if (isUploadSuccess && isRevalidateSuccess) {
      console.log('ALL GREAT');
      imageUrl = `${process.env.CLOUDFRONT}/${pathUpload}/${fileKeyWithExt}`;
    }

    await db.$transaction(async (tx) => {
      await tx.users.update({
        where: { userId: userObj?.id as string },
        data: { imageUrl },
      });

      await tx.books.updateMany({
        where: { userId: userObj?.id },
        data: { userImageUrl: imageUrl },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'File successfully uploaded',
        data: {
          imageUrl,
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Error upload file', e);
    return NextResponse.json(
      { success: false, message: 'Error uploading file' },
      { status: 500 }
    );
  }
}
