import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { toSlug } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") {
    data.name = body.name;
    data.slug = toSlug(body.name);
  }
  if ("order" in body) data.order = Number(body.order);

  const category = await prisma.category.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ category });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectCount = await prisma.project.count({
    where: { categoryId: params.id },
  });
  if (projectCount > 0) {
    return NextResponse.json(
      { error: `Move or delete the ${projectCount} project(s) in this category first.` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
