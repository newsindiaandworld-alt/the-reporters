import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { b2 } from "@/lib/b2";
import { isAuthenticated } from "@/lib/serverAuth";

export const runtime = "nodejs"; // Ensure Node runtime

const BUCKET = process.env.B2_BUCKET_NAME || "the-reporters-media-2026";

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: cleanFileName,
      Body: buffer,
      ContentType: file.type,
    });

    await b2.send(command);

    // Construct public URL
    const fileUrl = `https://${BUCKET}.s3.${
      process.env.B2_REGION || "eu-central-003"
    }.backblazeb2.com/${cleanFileName}`;

    return NextResponse.json({ success: true, fileUrl });
  } catch (error: any) {
    console.error("Backblaze Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
