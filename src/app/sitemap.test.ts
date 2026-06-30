jest.mock("@/data/actions/catalog");

import { dtestData } from "@tests";
import MockDate from "mockdate";
import { MetadataRoute } from "next";

import { getCatalogEntriesForSitemap } from "@/data/actions/catalog";
import { DCatalogEntrySitemapData } from "@/data/types/domain/catalog";
import { getProdAppMetadataUrl } from "@/lib/constants";

import sitemap, { dynamic } from "./sitemap";

const getCatalogEntriesForSitemapMock =
   getCatalogEntriesForSitemap as jest.MockedFunction<
      typeof getCatalogEntriesForSitemap
   >;

const appUrl = getProdAppMetadataUrl();

const toCatalogEntrySiteMapEntry = (entry: DCatalogEntrySitemapData) => {
   return {
      url: `${appUrl}/explore/${entry.slug}`,
      lastModified: entry.updatedAt,
      changeFrequency: "weekly",
      priority: 7,
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

   it("dymic - test", async () => {
      expect(dynamic).toEqual("force-dynamic");
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
