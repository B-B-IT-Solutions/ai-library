import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import {
   CatalogEntriesDashboard,
   catalogEntrySearchParamsCache,
} from "@/components/explore";

export const revalidate = 300;

export const metadata: Metadata = {
   title: "KI Prompt-Vorlagen entdecken",
   description:
      "Entdecke kuratierte AI-Prompt-Vorlagen mit strukturierten Feldern. Kostenlos durchsuchen, filtern und in deine Library übernehmen.",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const ExplorePage = async ({ searchParams }: PageProps) => {
   await catalogEntrySearchParamsCache.parse(searchParams);

   return (
      <div
         className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
         data-testid="explore-page"
      >
         <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
               KI Prompt-Vorlagen entdecken
            </h1>
            <p className="mt-3 text-base text-slate-500 sm:text-lg">
               Kuratierte Vorlagen mit strukturierten Feldern – für jeden
               Anwendungsfall.
               <br className="hidden sm:block" />
               Übernimm sie in deine Library und passe sie nach Bedarf an.
            </p>
         </div>

         <CatalogEntriesDashboard />
      </div>
   );
};

export default ExplorePage;
