import slugify from "slugify";

export function toSlug(input: string): string {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export function parseList(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function toCsv(list: string[]): string {
  return list.map((s) => s.trim()).filter(Boolean).join(", ");
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
