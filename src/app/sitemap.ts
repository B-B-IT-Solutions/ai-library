import type { MetadataRoute } from "next";

import { getCatalogEntriesForSitemap } from "@/data/actions/catalog";
import { getProductsForSitemap } from "@/data/actions/product";
import { getAppUrl } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const appUrl = getAppUrl();

   const [catalogEntries, products] = await Promise.all([
      getCatalogEntriesForSitemap(),
      getProductsForSitemap(),
   ]);

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

   const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${appUrl}/preview/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
   }));

   return [...staticRoutes, ...catalogRoutes, ...productRoutes];
}
