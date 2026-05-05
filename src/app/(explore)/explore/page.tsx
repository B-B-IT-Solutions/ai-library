import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { ExploreFeed, exploreSearchParamsCache } from "@/components/explore";
import { isAuthenticated } from "@/data/actions/auth-utils";
import {
   getCatalogEntryCategories,
   getPublishedCatalogEntriesPage,
} from "@/data/actions/catalog";
import { DCatalogEntriesPageQuery } from "@/data/types/domain/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
   title: "KI Prompt-Vorlagen entdecken",
   description:
      "Entdecke kuratierte AI-Prompt-Vorlagen mit strukturierten Feldern. Kostenlos durchsuchen, filtern und in deine Library übernehmen.",
};

type ExplorePageProps = {
   searchParams: Promise<SearchParams>;
};

const ExplorePage = async ({ searchParams }: ExplorePageProps) => {
   await exploreSearchParamsCache.parse(searchParams);

   const q = exploreSearchParamsCache.get("q");
   const category = exploreSearchParamsCache.get("category");
   const sort = exploreSearchParamsCache.get("sort");
   const page = exploreSearchParamsCache.get("page");

   const query: DCatalogEntriesPageQuery = {
      pagination: { pageNumber: page, pageSize: 12 },
      sort,
      filter: {
         search: q || undefined,
         categorySlug: category || undefined,
      },
   };

   const [entries, categories] = await Promise.all([
      getPublishedCatalogEntriesPage(query),
      getCatalogEntryCategories(),
   ]);

   return (
      <div
         className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
         data-testid="explore-page"
      >
         {/* Hero */}
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

         <ExploreFeed initialEntries={entries} categories={categories} />
      </div>
   );
};

export default ExplorePage;
