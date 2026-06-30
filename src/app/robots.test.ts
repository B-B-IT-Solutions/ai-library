import { MetadataRoute } from "next";

import { getProdAppMetadataUrl } from "@/lib/constants";

import robots from "./robots";

const exptectedRobots: MetadataRoute.Robots = {
   rules: [
      {
         userAgent: "*",
         allow: ["/$", "/explore/"],
         disallow: "/",
      },
   ],
   sitemap: `${getProdAppMetadataUrl()}/sitemap.xml`,
};

describe("robots - tests", () => {
   it("robots - test", () => {
      const result = robots();
      expect(result).toEqual(exptectedRobots);
   });
});
