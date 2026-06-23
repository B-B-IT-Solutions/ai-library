import Link from "next/link";

import { APP_NAME, getLandingPageUrl } from "@/lib/constants";

export const Footer = () => {
   const LANDING_PAGE_URL = getLandingPageUrl();

   return (
      <footer className="border-t bg-muted/40 py-10" data-testid="footer">
         <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-16 sm:flex-row">
               <div className="flex max-w-3xl flex-1 flex-col gap-5">
                  <Link
                     href="/"
                     className="text-lg whitespace-nowrap sm:text-xl"
                     data-testid="app-link"
                  >
                     {APP_NAME}
                  </Link>
                  <p className="text-muted-foreground">
                     Große Prompt-Bibliothek. Individuelle Anpassung. Leichte
                     Erstellung. Vision Notes revolutioniert deinen gesamten
                     Prompt-Workflow.
                  </p>
               </div>
               <div className="flex gap-16">
                  <div
                     className="flex flex-col gap-4"
                     data-testid="company-links"
                  >
                     <p className="text-muted-foreground">Unternehmen</p>
                     <nav className="flex flex-col gap-3">
                        <Link
                           href={`${LANDING_PAGE_URL}/blog`}
                           className="hover:underline"
                           data-testid="blog-link"
                        >
                           Blog
                        </Link>
                     </nav>
                  </div>
                  <div
                     className="flex flex-col gap-4"
                     data-testid="legal-links"
                  >
                     <p className="text-muted-foreground">Rechtliches</p>
                     <nav className="flex flex-col gap-3">
                        <Link
                           href="http://www.vision-notes.com/legal/agb"
                           className="hover:underline"
                           data-testid="agb-link"
                        >
                           AGB
                        </Link>
                        <Link
                           href="http://www.vision-notes.com/legal/privacypolicy"
                           className="hover:underline"
                           data-testid="privacypolicy-link"
                        >
                           Datenschutz
                        </Link>
                        <Link
                           href="http://www.vision-notes.com/legal/cookies"
                           className="hover:underline"
                           data-testid="cookies-link"
                        >
                           Cookies
                        </Link>
                        <Link
                           href={`${LANDING_PAGE_URL}/legal/impressum`}
                           className="hover:underline"
                           data-testid="impressum-link"
                        >
                           Impressum
                        </Link>
                     </nav>
                  </div>
               </div>
            </div>
            <div className="mt-10">
               <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} {APP_NAME}
               </p>
            </div>
         </div>
      </footer>
   );
};
