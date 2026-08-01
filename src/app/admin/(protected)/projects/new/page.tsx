import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tightest">New project</h1>
      <p className="mt-1 text-sm text-graphite">
        Save the details first — you&rsquo;ll be able to upload images, videos, and build a carousel on the next screen.
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 text-sm text-graphite">
          Create a category first before adding a project.
        </p>
      ) : (
        <div className="mt-8 max-w-3xl">
          <ProjectForm mode="create" categories={categories} />
        </div>
      )}
    </div>
  );
}
