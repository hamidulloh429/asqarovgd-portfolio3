import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const session = requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const allowedFields = [
    "siteTitle",
    "logoUrl",
    "faviconUrl",
    "heroTitle",
    "heroSubtitle",
    "heroIntro",
    "aboutText",
    "contactEmail",
    "contactTelegram",
    "contactInstagram",
    "contactWhatsapp",
    "contactLinkedin",
    "otherLinksJson",
  ];

  const data: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) data[key] = body[key];
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return NextResponse.json({ settings });
}
