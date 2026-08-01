import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

// POST /api/projects/reorder  { order: [projectId, projectId, ...] }
export async function POST(req: NextRequest) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { order } = await req.json();
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "order must be an array of ids" }, { status: 400 });
  }

  await prisma.$transaction(
    order.map((id: string, index: number) =>
      prisma.project.update({ where: { id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
