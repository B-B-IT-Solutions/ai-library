"use client";

import { useMemo } from "react";
import { filter, includes, isEmpty } from "es-toolkit/compat";
import { Search, X } from "lucide-react";
import { debounce, useQueryState } from "nuqs";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { ListViewToggle } from "@/components/shared/buttons";
import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import { DListViewMode } from "@/data/types/domain/common";
import { cn } from "@/lib/utils";
import { f_categoriesParam, f_searchParam } from "../../catalog-search-params";

import { CatalogSortBySelect } from "./sort-by";

type Props = {
   categories: DCatalogEntryCategory[];
   totalElements: number;
   viewMode: DListViewMode;
};

export const CatalogEntriesToolbar = ({
   categories,
   totalElements,
   viewMode,
}: Props) => {
   const [q, setQ] = useQueryState(
      "f_search",
      f_searchParam.withOptions({ shallow: false })
   );
   const [f_categories, setFCategories] = useQueryState(
      "f_categories",
      f_categoriesParam.withOptions({ shallow: false })
   );

   const hasActiveFilters = useMemo(
      () => !isEmpty(q) || !isEmpty(f_categories),
      [q, f_categories]
   );

   const activeFilterCount = useMemo(
      () => (isEmpty(q) ? 0 : 1) + f_categories.length,
      [q, f_categories]
   );

   const handleCategoryToggle = (slug: string | null) => {
      if (slug === null) {
         setFCategories(null);
      } else {
         const isActive = includes(f_categories, slug);
         const next = isActive
            ? filter(f_categories, (s) => s !== slug)
            : [...f_categories, slug];
         setFCategories(next, { limitUrlUpdates: debounce(400) });
      }
   };

   const handleResetFilters = () => {
      setQ(null);
      setFCategories(null);
   };

   return (
      <div className="mb-6 space-y-3" data-testid="catalog-entries-toolbar">
         <div className="flex flex-col gap-3 rounded-xl border bg-white px-5 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
               <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                     data-testid="explore-search-input"
                     placeholder="Suchen…"
                     value={q || ""}
                     onChange={(e) => setQ(e.target.value || null)}
                     className="h-8 w-full pl-9 text-sm sm:w-60"
                  />
               </div>
            </div>

            <div className="flex items-center gap-3">
               <CatalogSortBySelect />
               <span
                  className="min-w-[80px] shrink-0 text-right text-sm text-slate-500"
                  data-testid="entry-count"
               >
                  {totalElements} {totalElements === 1 ? "Vorlage" : "Vorlagen"}
               </span>
               <ListViewToggle currentView={viewMode} />
            </div>
         </div>

         {!isEmpty(categories) && (
            <div
               className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
               data-testid="explore-category-filter"
            >
               <Button
                  variant={isEmpty(f_categories) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryToggle(null)}
                  className="h-7 shrink-0 rounded-full px-3 text-xs"
               >
                  Alle ({totalElements})
               </Button>
               {categories.map((cat) => {
                  const isActive = includes(f_categories, cat.slug);
                  return (
                     <Button
                        key={cat.id}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryToggle(cat.slug)}
                        className={cn(
                           "h-7 shrink-0 rounded-full px-3 text-xs",
                           isActive && "font-semibold"
                        )}
                        data-testid={`explore-category-pill-${cat.slug}`}
                     >
                        {cat.name}
                     </Button>
                  );
               })}
               {hasActiveFilters && (
                  <>
                     <div className="mx-1 h-4 w-px shrink-0 bg-slate-200" />
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetFilters}
                        className="h-8 shrink-0 gap-1.5 px-2 text-xs text-slate-400 hover:text-slate-700"
                        data-testid="reset-filters-btn"
                     >
                        <X className="h-3.5 w-3.5" />
                        Filter löschen
                        <Badge
                           variant="secondary"
                           className="h-4 px-1.5 text-xs"
                           data-testid="active-filter-count"
                        >
                           {activeFilterCount}
                        </Badge>
                     </Button>
                  </>
               )}
            </div>
         )}
      </div>
   );
};
