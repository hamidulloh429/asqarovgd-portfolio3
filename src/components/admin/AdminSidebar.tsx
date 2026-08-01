"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Projects" },
  { href: "/admin/projects/new", label: "New project" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Site settings" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-mist bg-paper px-6 py-10 md:flex">
      <Link href="/" className="font-display text-lg font-semibold tracking-tightest">
        ASQAROVGD
      </Link>
      <p className="mt-1 text-xs text-graphite">Admin panel</p>

      <nav className="mt-10 flex flex-col gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2.5 text-sm transition-colors duration-200",
                active ? "bg-ink text-paper" : "text-graphite hover:bg-cloud hover:text-ink"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <p className="truncate text-xs text-graphite">{email}</p>
        <Link href="/" target="_blank" className="mt-3 block text-xs text-graphite underline-offset-2 hover:underline">
          View site ↗
        </Link>
        <button
          onClick={logout}
          className="mt-3 text-xs text-graphite underline-offset-2 hover:text-ink hover:underline"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
