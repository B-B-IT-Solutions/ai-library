"use client";

import { isEmpty } from "es-toolkit/compat";
import { useQueryState } from "nuqs";

import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import {
   f_categoriesParam,
   f_searchParam,
} from "../../../catalog-search-params";
import { CategoriesFilter } from ".";

type Props = {
   categories: DCatalogEntryCategory[];
   onSelect?: () => void;
};

export const CatalogEntryFilters = ({ categories, onSelect }: Props) => {
   const [search, setSearch] = useQueryState(
      "f_search",
      f_searchParam.withOptions({ shallow: false })
   );
   const [f_categories, setFCategories] = useQueryState(
      "f_categories",
      f_categoriesParam.withOptions({ shallow: false })
   );

   const hasActiveFilters = !isEmpty(search) || !isEmpty(f_categories);

   const handleReset = () => {
      setSearch(null);
      setFCategories(null);
   };

   return (
      <div data-testid="catalog-entry-filters">
         <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">Filter</span>
            {hasActiveFilters && (
               <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 transition-colors hover:text-slate-600"
                  data-testid="reset-filters-btn"
               >
                  Zurücksetzen
               </button>
            )}
         </div>
         <CategoriesFilter categories={categories} onSelect={onSelect} />
      </div>
   );
};
