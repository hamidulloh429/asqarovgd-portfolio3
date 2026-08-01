import { prisma } from "@/lib/prisma";
import AdminProjectList from "@/components/admin/AdminProjectList";
import type { Project } from "@/lib/types";

export default async function AdminDashboard() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      include: { category: true, media: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tightest">Projects</h1>
          <p className="mt-1 text-sm text-graphite">
            {projects.length} total · {projects.filter((p) => p.published).length} published
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AdminProjectList initialProjects={projects as unknown as Project[]} categories={categories} />
      </div>
    </div>
  );
}
