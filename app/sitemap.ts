import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return ["", "/exams", "/sign-in", "/sign-up"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
