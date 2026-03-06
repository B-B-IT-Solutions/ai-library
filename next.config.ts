import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: "standalone",
   outputFileTracingIncludes: {
      /* prisma needs to be in the dependencies if the migrations scripts are to be executed at the runtime */
      "/**": [
         "./node_modules/.prisma/**",
         "./node_modules/@prisma/**",
         "./node_modules/prisma/**",
         "./node_modules/effect/**",
         "./prisma/migrations/**",
      ],
   },
};

export default nextConfig;
