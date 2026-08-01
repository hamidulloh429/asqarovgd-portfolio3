import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@asqarovgd.com";
  const password = process.env.ADMIN_PASSWORD || "Gd2026#Studio!";

  // Always sync the password hash to the current env value (or default) on
  // every deploy, so changing ADMIN_PASSWORD and redeploying actually takes
  // effect — a plain find+create would silently keep the old password.
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin account ready: ${email}`);

  const defaultCategories = [
    { name: "Video / Motion", slug: "video-motion", order: 0 },
    { name: "Graphic Design", slug: "graphic-design", order: 1 },
    { name: "Branding / Logo", slug: "branding-logo", order: 2 },
    { name: "AI / Creative", slug: "ai-creative", order: 3 },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Ensured default categories exist.");

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      logoUrl: "/brand/logo.png",
      faviconUrl: "/brand/logo.png",
    },
  });
  console.log("Ensured site settings row exists.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
