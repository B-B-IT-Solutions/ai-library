import { map } from "es-toolkit/compat";
import type { MetadataRoute } from "next";

import { getCatalogEntriesForSitemap } from "@/data/actions/catalog";
import { DCatalogEntrySitemapData } from "@/data/types/domain/catalog";
import { getProdAppMetadataUrl } from "@/lib/constants";

export const dynamic = "force-dynamic";

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
   return toSiteMapEntry(url, entry.updatedAt, "weekly", 7);
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const appUrl = getProdAppMetadataUrl();

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

   const catalogRoutes: MetadataRoute.Sitemap = map(catalogEntries, (entry) =>
      toCatalogEntrySiteMapEntry(appUrl, entry)
   );

   return [...staticRoutes, ...catalogRoutes];
}
