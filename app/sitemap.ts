import type { MetadataRoute } from "next";
import { db } from "@/db";
import { exams } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  const routes: MetadataRoute.Sitemap = ["", "/exams", "/sign-in", "/sign-up"].map((path) => ({ url: `${base}${path}` }));
  try {
    const availableExams = await db.select({ subject: exams.subject, year: exams.year }).from(exams);
    const subjects = Array.from(new Set(availableExams.map(({ subject }) => subject)));
    routes.push(...subjects.map((subject) => ({
      url: `${base}/exams/${encodeURIComponent(subject)}`,
    })));
    routes.push(...availableExams.map(({ subject, year }) => ({
      url: `${base}/exams/${encodeURIComponent(subject)}/${encodeURIComponent(year)}`,
    })));
  } catch (error) {
    console.warn("Could not load exam routes for sitemap:", error);
  }
  return routes;
}
