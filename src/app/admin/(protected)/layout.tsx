import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSessionFromCookies();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cloud font-body md:flex-row">
      <div className="flex items-center justify-between border-b border-mist bg-paper px-6 py-4 md:hidden">
        <span className="font-display text-base font-semibold tracking-tightest">
          ASQAROVGD Admin
        </span>
        <a href="/admin" className="text-xs text-graphite underline-offset-2 hover:underline">
          Menu
        </a>
      </div>
      <AdminSidebar email={session.email} />
      <div className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
