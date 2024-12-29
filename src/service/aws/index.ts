/* eslint-disable no-console */
'use server';

import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
});

export async function s3UploadHelper(file: File, name: string, path: string) {
  try {
    if (typeof file !== 'object' || !file || file?.size === 0) {
      return '';
    }

    const ext = file.name.split('.').pop();
    const fileName = `${name}.${ext}`;

    const fileBuffer = (await file.arrayBuffer()) as ArrayBuffer;
    const params: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET as string,
      Key: `${path}/${fileName}`,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (e) {
    console.log('Error upload file', e);
    return false;
  }
}
