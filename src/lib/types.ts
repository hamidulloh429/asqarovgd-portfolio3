export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type Media = {
  id: string;
  projectId: string;
  type: "image" | "video";
  url: string;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  order: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string | null;
  year: number;
  tools: string;
  tags: string;
  coverUrl: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  published: boolean;
  featured: boolean;
  order: number;
  category: Category;
  categoryId: string;
  media: Media[];
};
