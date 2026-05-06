import { PutObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.S3_URL,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export const s3Bucket = process.env.S3_BUCKET!;

export const s3PublicUrl = (filename: string) =>
  `${process.env.S3_URL}/${s3Bucket}/${filename}`;

export const s3FileExists = async (filename: string): Promise<boolean> => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: s3Bucket, Key: filename }));
    return true;
  } catch {
    return false;
  }
};

export const s3Upload = async (filename: string, buffer: Buffer, contentType: string): Promise<void> => {
  await s3.send(new PutObjectCommand({
    Bucket: s3Bucket,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  }));
};