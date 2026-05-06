"use client";

import { FC } from "react";
import { filter, includes, isEmpty } from "es-toolkit/compat";
import { Check } from "lucide-react";
import { debounce, useQueryState } from "nuqs";

import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import { cn } from "@/lib/utils";
import { f_categoriesParam, f_searchParam } from "../../catalog-search-params";
import { CategoriesFilter } from "../toolbar/filters";

type Props = {
   categories: DCatalogEntryCategory[];
   totalElements: number;
   onSelect?: () => void;
};

export const CatalogFilterContent: FC<Props> = ({
   categories,
   totalElements,
   onSelect,
}) => {
   const [q, setQ] = useQueryState(
      "f_search",
      f_searchParam.withOptions({ shallow: false })
   );
   const [f_categories, setFCategories] = useQueryState(
      "f_categories",
      f_categoriesParam.withOptions({ shallow: false })
   );

   const hasActiveFilters = !isEmpty(q) || !isEmpty(f_categories);

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
      onSelect?.();
   };

   const handleReset = () => {
      setQ(null);
      setFCategories(null);
   };

   return (
      <div>
         <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">Filter</span>
            {hasActiveFilters && (
               <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 transition-colors hover:text-slate-600"
                  data-testid="sidebar-reset-btn"
               >
                  Zurücksetzen
               </button>
            )}
         </div>
         <CategoriesFilter
            categories={categories}
            totalElements={totalElements}
            onSelect={onSelect}
         />
         <div className="p-3">
            <p className="px-2 pb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
               Kategorien
            </p>
            <div className="space-y-0.5" data-testid="explore-category-filter">
               <button
                  onClick={() => handleCategoryToggle(null)}
                  className={cn(
                     "flex w-full items-center rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                     isEmpty(f_categories)
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-slate-600 hover:bg-slate-50"
                  )}
               >
                  Alle
                  <span className="ml-auto text-xs text-slate-400">
                     {totalElements}
                  </span>
               </button>
               {categories.map((cat) => {
                  const isActive = includes(f_categories, cat.slug);
                  return (
                     <button
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.slug)}
                        className={cn(
                           "flex w-full items-center rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                           isActive
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-slate-600 hover:bg-slate-50"
                        )}
                        data-testid={`sidebar-category-${cat.slug}`}
                     >
                        <span className="flex-1">{cat.name}</span>
                        {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                     </button>
                  );
               })}
            </div>
         </div>
      </div>
   );
};
