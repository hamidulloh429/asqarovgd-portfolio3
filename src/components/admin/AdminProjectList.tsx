"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminProjectList({
  initialProjects,
  categories,
}: {
  initialProjects: Project[];
  categories: Category[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  async function patch(id: string, data: Record<string, unknown>) {
    setBusyId(id);
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { project } = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...project } : p)));
    }
    setBusyId(null);
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusyId(id);
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setBusyId(null);
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    await fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((p) => p.id) }),
    });
    router.refresh();
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-mist bg-paper p-12 text-center">
        <p className="text-sm text-graphite">No projects yet.</p>
        <Link href="/admin/projects/new" className="mt-3 inline-block text-sm text-ember underline-offset-4 hover:underline">
          Add your first project
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-mist bg-paper">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-mist text-xs uppercase tracking-wide text-graphite">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Year</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Featured</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={p.id} className={cn("border-b border-mist last:border-none", busyId === p.id && "opacity-50")}>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">▲</button>
                  <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} className="disabled:opacity-30">▼</button>
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{p.title}</td>
              <td className="px-4 py-3 text-graphite">
                <select
                  value={p.categoryId}
                  onChange={(e) => patch(p.id, { categoryId: e.target.value })}
                  className="rounded border border-mist bg-paper px-2 py-1 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-graphite">{p.year}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => patch(p.id, { published: !p.published })}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs",
                    p.published ? "bg-ink text-paper" : "border border-mist text-graphite"
                  )}
                >
                  {p.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => patch(p.id, { featured: !p.featured })}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs",
                    p.featured ? "bg-ember text-paper" : "border border-mist text-graphite"
                  )}
                >
                  {p.featured ? "Yes" : "No"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Link href={`/admin/projects/${p.id}`} className="text-graphite hover:text-ink hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => remove(p.id, p.title)} className="text-graphite hover:text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
