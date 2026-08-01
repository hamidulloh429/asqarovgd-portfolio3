import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import MediaManager from "@/components/admin/MediaManager";
import type { Project, Media } from "@/lib/types";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
      include: { category: true, media: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!project) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm text-graphite hover:underline">
        ← All projects
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tightest">{project.title}</h1>
      <p className="mt-1 text-sm text-graphite">
        {project.published ? "Published" : "Draft"} · /work/{project.slug}
      </p>

      <div className="mt-8 max-w-3xl">
        <ProjectForm mode="edit" categories={categories} project={project as unknown as Project} />
        <MediaManager projectId={project.id} coverUrl={project.coverUrl} media={project.media as unknown as Media[]} />
      </div>
    </div>
  );
}
