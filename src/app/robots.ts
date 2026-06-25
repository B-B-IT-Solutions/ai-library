import type { MetadataRoute } from "next";

import { APP_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
   return {
      rules: [
         {
            userAgent: "*",
            allow: ["/explore"],
            disallow: ["/auth/*"],
         },
      ],
      sitemap: `${APP_URL}/sitemap.xml`,
   };
}
