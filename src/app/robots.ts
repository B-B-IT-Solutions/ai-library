import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
   return {
      rules: [
         {
            userAgent: "*",
            allow: ["/$", "/explore/"],
            disallow: "/",
         },
      ],
      sitemap: `${getAppUrl()}/sitemap.xml`,
   };
}
