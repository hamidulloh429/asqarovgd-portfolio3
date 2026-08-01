import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MediaCarousel from "@/components/MediaCarousel";
import { parseList } from "@/lib/utils";
import type { Media } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: { category: true, media: { orderBy: { order: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const tools = parseList(project.tools);
  const tags = parseList(project.tags);

  // Fallback: if no media rows exist yet, show the cover as the only slide.
  const media =
    project.media.length > 0
      ? project.media
      : project.coverUrl
      ? [
          {
            id: "cover",
            projectId: project.id,
            type: "image" as const,
            url: project.coverUrl,
            posterUrl: null,
            width: project.coverWidth,
            height: project.coverHeight,
            order: 0,
          },
        ]
      : [];

  return (
    <article className="container-x py-16">
      <Link
        href="/work"
        className="text-sm text-graphite underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        ← Back to work
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div className="reveal">
          <MediaCarousel media={media as unknown as Media[]} />
        </div>

        <aside className="reveal lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
            {project.category.name}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tightest md:text-4xl">
            {project.title}
          </h1>

          {project.description && (
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-graphite">
              {project.description}
            </p>
          )}

          <dl className="mt-8 space-y-4 border-t border-mist pt-6">
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-graphite">Year</dt>
              <dd className="text-right font-medium">{project.year}</dd>
            </div>
            {project.client && (
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-graphite">Client</dt>
                <dd className="text-right font-medium">{project.client}</dd>
              </div>
            )}
            {tools.length > 0 && (
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-graphite">Tools</dt>
                <dd className="text-right font-medium">{tools.join(", ")}</dd>
              </div>
            )}
          </dl>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="rounded-full border border-mist px-2.5 py-1 text-[11px] text-graphite">
                  {t}
                </span>
              ))}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
