import { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/constants";

import robots from "./robots";

const exptectedRobots: MetadataRoute.Robots = {
   rules: [
      {
         userAgent: "*",
         disallow: [
            "/auth/",
            "/prompts/",
            "/templates/",
            "/collections/",
            "/workflows/",
            "/settings/",
            "/subscription/",
            "/cart",
            "/checkout",
            "/marketplace",
            "/orders/",
            "/products/",
            "/api/",
         ],
      },
   ],
   sitemap: `${getAppUrl()}/sitemap.xml`,
};

describe("robots - tests", () => {
   it("robots - test", () => {
      const result = robots();
      expect(result).toEqual(exptectedRobots);
   });
});
