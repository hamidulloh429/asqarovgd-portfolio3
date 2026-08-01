import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { toSlug } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const slug = toSlug(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A category with this name already exists." }, { status: 409 });
  }

  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });
  const category = await prisma.category.create({
    data: { name, slug, order: (maxOrder._max.order ?? 0) + 1 },
  });

  return NextResponse.json({ category }, { status: 201 });
}
