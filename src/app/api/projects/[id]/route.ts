import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { toSlug } from "@/lib/utils";

async function findProject(id: string) {
  // Accept either a real id or a slug, so the public project page can use
  // a clean URL while the admin panel can reference by id.
  return prisma.project.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true, media: { orderBy: { order: "asc" } } },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await findProject(params.id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!project.published) {
    const session = requireSession();
    if (!session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  return NextResponse.json({ project });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.project.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.title === "string" && body.title !== existing.title) {
    data.title = body.title;
    let slug = toSlug(body.title);
    const clash = await prisma.project.findFirst({
      where: { slug, NOT: { id: existing.id } },
    });
    data.slug = clash ? `${slug}-${Date.now().toString(36)}` : slug;
  }
  for (const key of [
    "description",
    "client",
    "tools",
    "tags",
    "categoryId",
    "coverUrl",
  ] as const) {
    if (key in body) data[key] = body[key];
  }
  if ("year" in body) data.year = Number(body.year);
  if ("published" in body) data.published = Boolean(body.published);
  if ("featured" in body) data.featured = Boolean(body.featured);
  if ("order" in body) data.order = Number(body.order);
  if ("coverWidth" in body) data.coverWidth = body.coverWidth ? Number(body.coverWidth) : null;
  if ("coverHeight" in body) data.coverHeight = body.coverHeight ? Number(body.coverHeight) : null;

  const project = await prisma.project.update({
    where: { id: existing.id },
    data,
    include: { category: true, media: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ project });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.project.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
