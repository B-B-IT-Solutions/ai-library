export { auth as default } from "@/auth";

export const config = {
   matcher: [
      /*
       * Match all request paths except:
       * - api routes (handled separately)
       * - _next/static (static assets)
       * - _next/image (image optimisation)
       * - common static file extensions
       */
      "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
   ],
};
