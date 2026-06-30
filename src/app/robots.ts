import type { MetadataRoute } from "next";

import { getProdAppMetadataUrl } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
   return {
      rules: [
         {
            userAgent: "*",
            allow: ["/$", "/explore/"],
            disallow: "/",
         },
      ],
      sitemap: `${getProdAppMetadataUrl()}/sitemap.xml`,
   };
}
