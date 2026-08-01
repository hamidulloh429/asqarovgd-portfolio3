import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { saveUploadedFile } from "@/lib/upload";

// POST /api/upload  (multipart/form-data)
// Fields:
//   file        — required, the binary file
//   projectId   — optional, attach as Media to this project
//   role        — "media" (default) | "cover" | "logo" | "favicon" | "poster"
export async function POST(req: NextRequest) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const projectId = form.get("projectId") as string | null;
  const role = (form.get("role") as string | null) || "media";

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const saved = await saveUploadedFile(file);

    if (role === "media" && projectId) {
      const maxOrder = await prisma.media.aggregate({
        where: { projectId },
        _max: { order: true },
      });
      const media = await prisma.media.create({
        data: {
          projectId,
          type: saved.type,
          url: saved.url,
          width: saved.width,
          height: saved.height,
          order: (maxOrder._max.order ?? -1) + 1,
        },
      });
      return NextResponse.json({ saved, media }, { status: 201 });
    }

    return NextResponse.json({ saved }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
