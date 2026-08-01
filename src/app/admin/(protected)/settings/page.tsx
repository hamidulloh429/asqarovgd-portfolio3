import { prisma } from "@/lib/prisma";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tightest">Site settings</h1>
      <p className="mt-1 text-sm text-graphite">
        Edit the homepage text, branding, and contact links shown across the site.
      </p>
      <div className="mt-8 max-w-2xl">
        <AdminSettingsForm settings={settings} />
      </div>
    </div>
  );
}
