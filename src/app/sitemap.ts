import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/shared";
import { researchSource, source } from "@/lib/source";

export const revalidate = false;

function mapPages(
  pages: ReturnType<typeof source.getPages>,
): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page.slugs.length === 0 ? 1 : 0.8,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...mapPages(source.getPages()),
    ...mapPages(researchSource.getPages()),
  ];
}
