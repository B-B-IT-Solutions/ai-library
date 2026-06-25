import type { MetadataRoute } from "next";

import prisma from "@/data/repositories/prisma";
import { getAppUrl } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const appUrl = getAppUrl();

   const [catalogEntries, products] = await Promise.all([
      prisma.catalogEntry.findMany({
         where: { status: "PUBLISHED" },
         select: { slug: true, updatedAt: true },
         orderBy: { createdAt: "asc" },
      }),
      prisma.product.findMany({
         where: { status: "ACTIVE" },
         select: { id: true, updatedAt: true },
         orderBy: { createdAt: "asc" },
      }),
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
      changeFrequency: "weekly",
      priority: 0.7,
   }));

   const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${appUrl}/preview/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
   }));

   return [...staticRoutes, ...catalogRoutes, ...productRoutes];
}
