"use client";

import Image from "next/image";

// Renders a cover image or single media item at its true aspect ratio.
// Falls back to a 4:5 ratio (the site's default portrait grid rhythm) only
// when no dimensions are known, so a wide 16:9 cover is never squeezed into
// a portrait box, and a 9:16 Reel-style cover is never cropped square.
export default function MediaFrame({
  src,
  poster,
  type = "image",
  width,
  height,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className = "",
  priority = false,
  controls = false,
  autoPlay = false,
  loop = true,
  muted = true,
}: {
  src: string;
  poster?: string | null;
  type?: "image" | "video";
  width?: number | null;
  height?: number | null;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}) {
  const ratio = width && height ? width / height : 4 / 5;

  return (
    <div className={`relative w-full overflow-hidden bg-cloud ${className}`} style={{ aspectRatio: ratio }}>
      {type === "video" ? (
        <video
          src={src}
          poster={poster || undefined}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          preload="none"
          className="h-full w-full object-contain"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}
