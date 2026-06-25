import type { MetadataRoute } from "next";

import { getCatalogEntriesForSitemap } from "@/data/actions/catalog";
import { getAppUrl } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const appUrl = getAppUrl();

   const [catalogEntries] = await Promise.all([getCatalogEntriesForSitemap()]);

   const staticRoutes: MetadataRoute.Sitemap = [
      {
         url: appUrl,
         lastModified: new Date(),
         changeFrequency: "weekly",
         priority: 1.0,
      },
      {
         url: `${appUrl}/explore`,
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.9,
      },
      {
         url: `${appUrl}/preview/marketplace`,
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.8,
      },
   ];

   const catalogRoutes: MetadataRoute.Sitemap = catalogEntries.map((entry) => ({
      url: `${appUrl}/explore/${entry.slug}`,
      lastModified: entry.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
   }));

   return [...staticRoutes, ...catalogRoutes];
}
