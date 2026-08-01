"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Media } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MediaManager({
  projectId,
  coverUrl,
  media: initialMedia,
}: {
  projectId: string;
  coverUrl: string | null;
  media: Media[];
}) {
  const router = useRouter();
  const [media, setMedia] = useState(initialMedia);
  const [cover, setCover] = useState(coverUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null, asCover: boolean) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      if (!asCover) {
        form.append("projectId", projectId);
        form.append("role", "media");
      } else {
        form.append("role", "cover");
      }

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        continue;
      }

      if (asCover) {
        const coverUrl = data.saved.url;
        await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coverUrl,
            coverWidth: data.saved.width,
            coverHeight: data.saved.height,
          }),
        });
        setCover(coverUrl);
      } else if (data.media) {
        setMedia((prev) => [...prev, data.media]);
      }
    }

    setUploading(false);
    router.refresh();
  }

  async function removeMedia(id: string) {
    if (!confirm("Remove this media item?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setMedia((prev) => prev.filter((m) => m.id !== id));
    router.refresh();
  }

  async function moveMedia(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= media.length) return;
    const next = [...media];
    [next[index], next[target]] = [next[target], next[index]];
    setMedia(next);
    await Promise.all(
      next.map((m, i) => fetch(`/api/media/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: i }),
      }))
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-mist bg-paper p-6">
      <h2 className="font-display text-lg font-semibold tracking-tightest">Media</h2>
      <p className="mt-1 text-sm text-graphite">
        Upload the cover shown in the portfolio grid, and the images/videos shown in the project carousel.
        Vertical 1080×1920 video and 4:5 / 9:16 images are supported natively — nothing gets cropped.
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* Cover */}
      <div className="mt-6">
        <p className="text-xs font-medium text-graphite">Cover image</p>
        <div className="mt-2 flex items-center gap-4">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="Cover" className="h-24 w-24 rounded-md object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-cloud text-[10px] text-graphite">
              No cover
            </div>
          )}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-mist px-4 py-2 text-xs font-medium transition-colors hover:border-ink disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload cover"}
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files, true)}
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-graphite">Carousel media ({media.length})</p>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-ember disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Add images / videos"}
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files, false)}
          />
        </div>

        {media.length === 0 ? (
          <p className="mt-4 text-sm text-graphite">No media uploaded yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {media.map((m, i) => (
              <div key={m.id} className={cn("group relative overflow-hidden rounded-md border border-mist")}>
                {m.type === "video" ? (
                  <video src={m.url} className="h-32 w-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="h-32 w-full object-cover" />
                )}
                <span className="absolute left-1.5 top-1.5 rounded bg-paper/90 px-1.5 py-0.5 text-[10px] uppercase text-graphite">
                  {m.type}
                </span>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/70 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveMedia(i, -1)} className="text-xs text-paper">←</button>
                    <button type="button" onClick={() => moveMedia(i, 1)} className="text-xs text-paper">→</button>
                  </div>
                  <button type="button" onClick={() => removeMedia(m.id)} className="text-xs text-paper hover:text-red-300">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
