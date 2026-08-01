import { prisma } from "@/lib/prisma";
import AdminCategories from "@/components/admin/AdminCategories";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tightest">Categories</h1>
      <p className="mt-1 text-sm text-graphite">
        These power the filter tabs on the Work page.
      </p>
      <div className="mt-8 max-w-xl">
        <AdminCategories
          initialCategories={categories.map((c) => ({ ...c, projectCount: c._count.projects }))}
        />
      </div>
    </div>
  );
}
