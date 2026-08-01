"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

type CategoryWithCount = Category & { projectCount: number };

export default function AdminCategories({
  initialCategories,
}: {
  initialCategories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not create category.");
    } else {
      setCategories((prev) => [...prev, { ...data.category, projectCount: 0 }]);
      setName("");
      router.refresh();
    }
    setSaving(false);
  }

  async function rename(id: string, newName: string) {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const { category } = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...category } : c)));
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not delete category.");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={addCategory} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-md border border-mist bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ember disabled:opacity-60"
        >
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 divide-y divide-mist rounded-lg border border-mist bg-paper">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3">
            <input
              defaultValue={c.name}
              onBlur={(e) => e.target.value !== c.name && rename(c.id, e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none focus:underline"
            />
            <span className="text-xs text-graphite">{c.projectCount} project(s)</span>
            <button onClick={() => remove(c.id)} className="text-xs text-graphite hover:text-red-600 hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
