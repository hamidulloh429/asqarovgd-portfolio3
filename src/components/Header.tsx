"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Header({
  siteTitle,
  logoUrl,
}: {
  siteTitle: string;
  logoUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-mist/80 bg-paper/85 backdrop-blur-md">
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tightest"
          onClick={() => setOpen(false)}
        >
          {logoUrl ? (
            <Image src={logoUrl} alt={siteTitle} width={30} height={30} className="rounded-full" />
          ) : (
            <span className="inline-block h-2.5 w-2.5 animate-pulse-soft rounded-full bg-ember" />
          )}
          {siteTitle}
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href === "/work" && pathname.startsWith("/work"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative py-1 font-body text-sm text-graphite transition-colors duration-300 hover:text-ink",
                  active && "text-ink"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-300 ease-smooth group-hover:scale-x-100",
                    active && "scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={cn("h-px w-5 bg-ink transition-transform duration-300", open && "translate-y-[3.5px] rotate-45")} />
          <span className={cn("h-px w-5 bg-ink transition-transform duration-300", open && "-translate-y-[3.5px] -rotate-45")} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-mist bg-paper px-6 py-4 md:hidden animate-fade-in">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-mist py-3.5 font-body text-sm text-graphite last:border-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
