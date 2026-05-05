"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/shadcn/button";
import {
   DCatalogEntriesPage,
   DCatalogEntryCategory,
} from "@/data/types/domain/catalog";

import { ExploreEntryGrid } from "./explore-entry-grid";
import { ExploreFilterBar } from "./explore-filter-bar";
import { pageParam } from "./explore-search-params";

type Props = {
   initialEntries: DCatalogEntriesPage;
   categories: DCatalogEntryCategory[];
};

export const ExploreFeed = ({ initialEntries, categories }: Props) => {
   const [page, setPage] = useQueryState(
      "page",
      pageParam.withOptions({ shallow: false })
   );

   const { content, totalPages, totalElements, pageNumber } = initialEntries;
   const hasPrev = pageNumber > 0;
   const hasNext = pageNumber < totalPages - 1;

   return (
      <div className="space-y-6" data-testid="explore-feed">
         <ExploreFilterBar
            categories={categories}
            totalElements={totalElements}
         />

         <ExploreEntryGrid entries={content} />

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
               <p className="text-sm text-slate-500">
                  Seite {pageNumber + 1} von {totalPages} · {totalElements}{" "}
                  Vorlagen
               </p>
               <div className="flex gap-2">
                  <Button
                     variant="outline"
                     size="sm"
                     disabled={!hasPrev}
                     onClick={() => setPage(Math.max(0, page - 1))}
                     data-testid="explore-prev-page"
                  >
                     <ChevronLeft className="h-4 w-4" />
                     Zurück
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     disabled={!hasNext}
                     onClick={() => setPage(page + 1)}
                     data-testid="explore-next-page"
                  >
                     Weiter
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
};
