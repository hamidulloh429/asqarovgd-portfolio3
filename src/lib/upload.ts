import { put } from "@vercel/blob";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);
const VIDEO_EXT = new Set(["mp4", "mov", "webm", "m4v"]);

export type SavedFile = {
  url: string;
  type: "image" | "video";
  width?: number;
  height?: number;
};

// Files are stored on Vercel Blob (not the local filesystem), because
// Vercel's serverless functions run on a read-only, ephemeral filesystem —
// anything written to disk there disappears after the request finishes.
export async function saveUploadedFile(file: File): Promise<SavedFile> {
  const maxMb = Number(process.env.MAX_UPLOAD_MB || 200);
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`File exceeds the ${maxMb}MB upload limit.`);
  }

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isImage = IMAGE_EXT.has(ext);
  const isVideo = VIDEO_EXT.has(ext);
  if (!isImage && !isVideo) {
    throw new Error(`Unsupported file type: .${ext}`);
  }

  const subdir = isImage ? "images" : "videos";
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${uuid()}.${ext}`;

  const blob = await put(`${subdir}/${filename}`, buffer, {
    access: "public",
    contentType: file.type || undefined,
  });

  const url = blob.url;

  if (isImage) {
    try {
      const meta = await sharp(buffer).metadata();
      return { url, type: "image", width: meta.width, height: meta.height };
    } catch {
      return { url, type: "image" };
    }
  }

  return { url, type: "video" };
}
