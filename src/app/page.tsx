import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const featured = await prisma.project.findMany({
    where: { published: true, featured: true },
    include: { category: true, media: { orderBy: { order: "asc" } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 6,
  });

  const fallback = featured.length
    ? []
    : await prisma.project.findMany({
        where: { published: true },
        include: { category: true, media: { orderBy: { order: "asc" } } },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: 6,
      });

  const showcase = featured.length ? featured : fallback;

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-72px)] flex-col justify-center overflow-hidden py-24">
        {/* Ambient motion blobs */}
        <div
          className="blob animate-blob-float -left-24 -top-24 h-[26rem] w-[26rem] bg-ember"
          aria-hidden="true"
        />
        <div
          className="blob animate-blob-float-2 -right-32 top-1/3 h-[22rem] w-[22rem] bg-emberLight"
          aria-hidden="true"
        />
        <div
          className="absolute right-[8%] top-[18%] hidden h-16 w-16 rounded-full border border-ember/30 md:block animate-spin-slow"
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ember" />
        </div>

        <div className="container-x relative">
          <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-graphite">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-ember align-middle" />
            {settings.heroSubtitle}
          </p>
          <h1 className="mt-5 max-w-4xl overflow-hidden font-display text-[13vw] font-semibold leading-[0.95] tracking-tightest sm:text-7xl md:text-8xl">
            <span className="inline-block animate-word-up" style={{ animationDelay: "80ms" }}>
              {settings.heroTitle}
            </span>
          </h1>
          <p className="reveal mt-8 max-w-lg text-base leading-relaxed text-graphite md:text-lg">
            {settings.heroIntro}
          </p>
          <div className="reveal mt-10 flex flex-wrap gap-4">
            <Link
              href="/work"
              className="group relative overflow-hidden rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-transform duration-300 ease-smooth hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-ember transition-transform duration-300 ease-smooth group-hover:translate-x-0" />
              <span className="relative">View My Work</span>
            </Link>
            <a
              href="#contact"
              className="rounded-full border border-mist px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:border-ember hover:text-ember"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Motion ticker strip */}
        <div className="marquee-row reveal mt-20 overflow-hidden border-y border-mist/70 py-3">
          <div className="marquee-track gap-10">
            {Array.from({ length: 2 }).map((_, row) => (
              <div key={row} className="flex shrink-0 items-center gap-10 pr-10">
                {[
                  "Motion Design",
                  "Video Editing",
                  "Brand Identity",
                  "AI Creative",
                  "Graphic Design",
                ].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-graphite"
                  >
                    {t}
                    <span className="h-1 w-1 rounded-full bg-ember" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {showcase.length > 0 && (
        <section className="container-x py-20">
          <div className="reveal flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tightest md:text-4xl">
              Selected work
            </h2>
            <Link
              href="/work"
              className="hidden text-sm text-graphite underline-offset-4 transition-colors hover:text-ink hover:underline md:inline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p, i) => (
              <ProjectCard key={p.id} project={p as unknown as Project} index={i} />
            ))}
          </div>

          <Link
            href="/work"
            className="mt-10 inline-block text-sm text-graphite underline-offset-4 transition-colors hover:text-ink hover:underline md:hidden"
          >
            View all work →
          </Link>
        </section>
      )}

      {/* ABOUT */}
      <section id="about" className="relative overflow-hidden border-t border-mist bg-cloud py-24">
        <div
          className="blob animate-blob-float-2 -bottom-32 -right-20 h-72 w-72 bg-ember opacity-[0.08]"
          aria-hidden="true"
        />
        <div className="container-x relative grid grid-cols-1 gap-10 md:grid-cols-[1fr_2fr]">
          <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-graphite">
            About
          </p>
          <p className="reveal max-w-2xl whitespace-pre-line text-xl leading-relaxed text-ink md:text-2xl">
            {settings.aboutText}
          </p>
        </div>
      </section>
    </>
  );
}
