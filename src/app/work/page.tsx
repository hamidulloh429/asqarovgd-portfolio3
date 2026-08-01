import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProjectGrid from "@/components/ProjectGrid";
import type { Project } from "@/lib/types";

export const metadata: Metadata = { title: "Work" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      include: { category: true, media: { orderBy: { order: "asc" } } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <section className="container-x py-20">
      <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-graphite">
        Portfolio
      </p>
      <h1 className="reveal mt-4 font-display text-5xl font-semibold tracking-tightest md:text-6xl">
        Work
      </h1>

      <div className="mt-12">
        <ProjectGrid projects={projects as unknown as Project[]} categories={categories} />
      </div>
    </section>
  );
}
