"use client";

import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Category, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProjectGrid({
  projects,
  categories,
  initialCategorySlug = "all",
}: {
  projects: Project[];
  categories: Category[];
  initialCategorySlug?: string;
}) {
  const [active, setActive] = useState(initialCategorySlug);

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.category.slug === active);
  }, [projects, active]);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => setActive("all")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
            active === "all"
              ? "border-ink bg-ink text-paper"
              : "border-mist text-graphite hover:border-ink hover:text-ink"
          )}
        >
          All work
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.slug)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
              active === c.slug
                ? "border-ink bg-ink text-paper"
                : "border-mist text-graphite hover:border-ink hover:text-ink"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-sm text-graphite">
          No published projects in this category yet.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
