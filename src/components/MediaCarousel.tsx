"use client";

import { useState, useCallback, useEffect } from "react";
import MediaFrame from "./MediaFrame";
import type { Media } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MediaCarousel({ media }: { media: Media[] }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + media.length) % media.length);
    },
    [media.length]
  );

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, go]);

  if (media.length === 0) return null;
  const current = media[index];

  return (
    <div>
      <div className="group relative">
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="block w-full cursor-zoom-in"
          aria-label="Open fullscreen"
        >
          <MediaFrame
            src={current.url}
            poster={current.posterUrl}
            type={current.type}
            width={current.width}
            height={current.height}
            alt="Project media"
            priority={index === 0}
            className="rounded-sm"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
        </button>

        {media.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/80 p-2.5 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/80 p-2.5 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100"
            >
              →
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors duration-300",
                i === index ? "border-ember" : "border-transparent"
              )}
            >
              <MediaFrame
                src={m.type === "video" ? m.posterUrl || m.url : m.url}
                type={m.type === "video" && !m.posterUrl ? "video" : "image"}
                width={m.width}
                height={m.height}
                alt=""
                className="h-full"
              />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-ink/97 p-4 backdrop-blur-sm animate-fade-in md:p-8"
          onClick={() => setFullscreen(false)}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 z-10 text-2xl text-paper"
            onClick={() => setFullscreen(false)}
          >
            ✕
          </button>
          <div
            className="m-auto flex max-h-full max-w-5xl items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {current.type === "video" ? (
              <video
                src={current.url}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-auto max-w-full"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.url}
                alt="Project media, fullscreen"
                className="max-h-[85vh] w-auto max-w-full object-contain"
              />
            )}
          </div>
          {media.length > 1 && (
            <div className="absolute inset-x-0 bottom-6 flex justify-center gap-6 text-paper">
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous">←</button>
              <span className="font-mono text-xs">
                {index + 1} / {media.length}
              </span>
              <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next">→</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
