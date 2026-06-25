import type { MetadataRoute } from "next";

import { getCatalogEntriesForSitemap } from "@/data/actions/catalog";
import { DCatalogEntrySitemapData } from "@/data/types/domain/catalog";
import { getAppUrl } from "@/lib/constants";

const toSiteMapEntry = (
   url: string,
   lastModified: Date | string,
   changeFrequency: "weekly" | "daily",
   priority: number
) => {
   return {
      url,
      lastModified,
      changeFrequency,
      priority,
   };
};

const toCatalogEntrySiteMapEntry = (
   appUrl: string,
   entry: DCatalogEntrySitemapData
) => {
   const url = `${appUrl}/explore/${entry.slug}`;
   const lastModified = entry.updatedAt;
   const frequency = "weekly" as const;
   const priority = 7;
   return toSiteMapEntry(url, lastModified, frequency, priority);
};

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
      // {
      //    url: `${appUrl}/preview/marketplace`,
      //    lastModified: new Date(),
      //    changeFrequency: "daily",
      //    priority: 0.8,
      // },
   ];

   const catalogRoutes: MetadataRoute.Sitemap = catalogEntries.map((entry) => {
      return toCatalogEntrySiteMapEntry(appUrl, entry);
   });

   return [...staticRoutes, ...catalogRoutes];
}
