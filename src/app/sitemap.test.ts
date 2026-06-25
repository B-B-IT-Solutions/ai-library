jest.mock("@/data/actions/catalog");

import { dtestData } from "@tests";
import MockDate from "mockdate";
import { MetadataRoute } from "next";

import { getCatalogEntriesForSitemap } from "@/data/actions/catalog";
import { DCatalogEntrySitemapData } from "@/data/types/domain/catalog";
import { getAppUrl } from "@/lib/constants";

import sitemap from "./sitemap";

const getCatalogEntriesForSitemapMock =
   getCatalogEntriesForSitemap as jest.MockedFunction<
      typeof getCatalogEntriesForSitemap
   >;

const appUrl = getAppUrl();

const toCatalogEntrySiteMapEntry = (entry: DCatalogEntrySitemapData) => {
   const url = `${appUrl}/explore/${entry.slug}`;
   const lastModified = entry.updatedAt;
   const changeFrequency = "weekly" as const;
   const priority = 7;
   return {
      url,
      lastModified,
      changeFrequency,
      priority,
   };
};

const expectedStaticRoutes = (): MetadataRoute.Sitemap => {
   return [
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
};

describe("sitemap tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("static routes - test", async () => {
      getCatalogEntriesForSitemapMock.mockResolvedValue([]);
      const map = await sitemap();
      const expectedMap = expectedStaticRoutes();

      expect(map).toHaveLength(2);
      expect(map[0]).toMatchObject(expectedMap[0]);
      expect(map[1]).toMatchObject(expectedMap[1]);
   });

   it("catalog entries routes - test", async () => {
      const entries = dtestData.dCatalogEntriesSitemapData(3);
      getCatalogEntriesForSitemapMock.mockResolvedValue(entries);

      const map = await sitemap();

      const expectedMap = expectedStaticRoutes();

      expect(map).toHaveLength(5);
      expect(map[0]).toMatchObject(expectedMap[0]);
      expect(map[1]).toMatchObject(expectedMap[1]);
      expect(map[2]).toMatchObject(toCatalogEntrySiteMapEntry(entries[0]));
      expect(map[3]).toMatchObject(toCatalogEntrySiteMapEntry(entries[1]));
      expect(map[4]).toMatchObject(toCatalogEntrySiteMapEntry(entries[2]));
   });
});
