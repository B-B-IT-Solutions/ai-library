jest.mock("@/data/actions/catalog");

import { getCatalogEntriesForSitemap } from "@/data/actions/catalog";

import sitemap from "./sitemap";

const getCatalogEntriesForSitemapMock =
   getCatalogEntriesForSitemap as jest.MockedFunction<
      typeof getCatalogEntriesForSitemap
   >;

const APP_URL = "http://localhost:3000";

describe("sitemap tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      getCatalogEntriesForSitemapMock.mockResolvedValue([]);
   });

   it("includes homepage as first static route - test", async () => {
      const result = await sitemap();

      expect(result[0]).toMatchObject({
         url: APP_URL,
         changeFrequency: "weekly",
         priority: 1.0,
      });
   });

   it("includes explore page as second static route - test", async () => {
      const result = await sitemap();

      expect(result[1]).toMatchObject({
         url: `${APP_URL}/explore`,
         changeFrequency: "daily",
         priority: 0.9,
      });
   });

   it("includes catalog entry routes after static routes - test", async () => {
      getCatalogEntriesForSitemapMock.mockResolvedValue([
         { slug: "my-entry", updatedAt: "2025-09-27T00:00:00.000Z" },
      ]);

      const result = await sitemap();

      expect(result).toContainEqual({
         url: `${APP_URL}/explore/my-entry`,
         lastModified: "2025-09-27T00:00:00.000Z",
         changeFrequency: "weekly",
         priority: 0.7,
      });
   });

   it("has correct total length with dynamic routes - test", async () => {
      getCatalogEntriesForSitemapMock.mockResolvedValue([
         { slug: "entry-1", updatedAt: "2025-09-27T00:00:00.000Z" },
         { slug: "entry-2", updatedAt: "2025-09-27T00:00:00.000Z" },
      ]);
      const result = await sitemap();

      // 3 static + 2 catalog + 1 product
      expect(result).toHaveLength(6);
   });
});
