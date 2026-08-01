import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

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
  if ("order" in body) data.order = Number(body.order);
  if ("posterUrl" in body) data.posterUrl = body.posterUrl;

  const media = await prisma.media.update({ where: { id: params.id }, data });
  return NextResponse.json({ media });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.media.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
