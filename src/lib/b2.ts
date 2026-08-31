import { S3Client } from "@aws-sdk/client-s3";

// B2's S3-compatible API requires path-style URLs:
// https://s3.<region>.backblazeb2.com/<bucket>/<key>
export const b2 = new S3Client({
  endpoint: process.env.B2_ENDPOINT || "https://s3.eu-central-003.backblazeb2.com",
  region: process.env.B2_REGION || "eu-central-003",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID as string,
    secretAccessKey: process.env.B2_APPLICATION_KEY as string,
  },
  forcePathStyle: true,
});
