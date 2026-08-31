"use client";

export interface UploadedMedia {
  key: string;
  url: string;
  type: string;
  name: string;
}

/**
 * Uploads a file directly to Backblaze B2 through our server-side
 * /api/upload route (multipart/form-data). The server streams the file to
 * B2 itself, so there's no presigned URL and no browser-to-B2 CORS involved.
 */
export async function uploadFileToB2(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadedMedia> {
  const fileUrl = await new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      let data: { success?: boolean; fileUrl?: string; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // fall through to the generic error below
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.success && data.fileUrl) {
        resolve(data.fileUrl);
      } else {
        reject(new Error(data.error || `Upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });

  const key = fileUrl.split("/").pop() || file.name;

  return { key, url: fileUrl, type: file.type, name: file.name };
}
