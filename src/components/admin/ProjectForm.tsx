"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Project } from "@/lib/types";

export default function ProjectForm({
  mode,
  categories,
  project,
}: {
  mode: "create" | "edit";
  categories: Category[];
  project?: Project;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title || "");
  const [categoryId, setCategoryId] = useState(project?.categoryId || categories[0]?.id || "");
  const [year, setYear] = useState(project?.year || new Date().getFullYear());
  const [client, setClient] = useState(project?.client || "");
  const [description, setDescription] = useState(project?.description || "");
  const [tools, setTools] = useState(project?.tools || "");
  const [tags, setTags] = useState(project?.tags || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = { title, categoryId, year, client, description, tools, tags };

    try {
      if (mode === "create") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create project.");
        router.push(`/admin/projects/${data.project.id}`);
        router.refresh();
      } else if (project) {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save.");
        setSavedAt(Date.now());
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-mist bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-mist bg-paper p-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-graphite">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-medium text-graphite">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-graphite">Year</label>
          <input
            type="number"
            required
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-graphite">Client (optional)</label>
          <input value={client} onChange={(e) => setClient(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-medium text-graphite">Tools / software (comma-separated)</label>
          <input value={tools} onChange={(e) => setTools(e.target.value)} className={inputClass} placeholder="After Effects, Premiere Pro" />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-graphite">Tags (comma-separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="Reel, Fashion, 9:16" />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-graphite">Description</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ember disabled:opacity-60"
        >
          {saving ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
        </button>
        {savedAt && <span className="text-xs text-graphite">Saved.</span>}
      </div>
    </form>
  );
}
