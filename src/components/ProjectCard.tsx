import Link from "next/link";
import MediaFrame from "./MediaFrame";
import type { Project } from "@/lib/types";
import { parseList } from "@/lib/utils";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const tags = parseList(project.tags).slice(0, 3);
  const cover = project.coverUrl || project.media[0]?.url;
  const coverType = project.coverUrl ? "image" : project.media[0]?.type || "image";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="reveal group block transition-transform duration-300 ease-smooth hover:-translate-y-1.5"
      style={{ transitionDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <div className="relative">
        {cover ? (
          <div className="media-zoom rounded-sm shadow-none transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-ink/10">
            <MediaFrame
              src={cover}
              poster={project.media[0]?.posterUrl}
              type={coverType as "image" | "video"}
              width={project.coverWidth || project.media[0]?.width}
              height={project.coverHeight || project.media[0]?.height}
              alt={project.title}
              className="rounded-sm"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-sm bg-cloud text-xs text-graphite">
            No preview
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-ember">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-graphite">
            {project.category.name} · {project.year}
          </p>
        </div>
        <span className="mt-1 shrink-0 -translate-x-1 text-ember opacity-0 transition-all duration-300 ease-smooth group-hover:translate-x-0 group-hover:opacity-100">
          ↗
        </span>
      </div>

      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-mist px-2 py-0.5 text-[11px] text-graphite">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
