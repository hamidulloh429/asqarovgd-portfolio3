import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { toSlug } from "@/lib/utils";

// GET /api/projects?category=slug&published=1
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const includeUnpublished = searchParams.get("all") === "1";

  const session = includeUnpublished ? requireSession() : null;
  if (includeUnpublished && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: {
      ...(includeUnpublished ? {} : { published: true }),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true, media: { orderBy: { order: "asc" } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ projects });
}

// POST /api/projects — create a new project (admin only)
export async function POST(req: NextRequest) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, categoryId, year, description, client, tools, tags } = body;

  if (!title || !categoryId || !year) {
    return NextResponse.json(
      { error: "Title, category, and year are required." },
      { status: 400 }
    );
  }

  let slug = toSlug(title);
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description: description || "",
      client: client || null,
      year: Number(year),
      tools: tools || "",
      tags: tags || "",
      categoryId,
      order: (maxOrder._max.order ?? 0) + 1,
    },
    include: { category: true, media: true },
  });

  return NextResponse.json({ project }, { status: 201 });
}
