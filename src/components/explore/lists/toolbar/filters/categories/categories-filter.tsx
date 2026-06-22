"use client";

import { filter, includes, isEmpty } from "es-toolkit/compat";
import { Check } from "lucide-react";
import { debounce, useQueryState } from "nuqs";

import { CallbackFn } from "@/data/types/common";
import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import { cn } from "@/lib/utils";
import { f_categoriesParam } from "../../../../catalog-search-params";

type Props = {
   categories: DCatalogEntryCategory[];
   onSelect?: CallbackFn;
};

export const CategoriesFilter = ({ categories, onSelect }: Props) => {
   const [f_categories, setFCategories] = useQueryState(
      "f_categories",
      f_categoriesParam.withOptions({ shallow: false })
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
      onSelect?.();
   };

   const category = (cat: DCatalogEntryCategory) => {
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
            data-testid={`category-${cat.slug}`}
         >
            <span className="flex-1">{cat.name}</span>
            {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
         </button>
      );
   };

   return (
      <div className="p-3" data-testid="categories-filter">
         <p className="px-2 pb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Kategorien
         </p>
         <div className="space-y-0.5">
            <button
               onClick={() => handleCategoryToggle(null)}
               className={cn(
                  "flex w-full items-center rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  isEmpty(f_categories)
                     ? "bg-primary/10 font-medium text-primary"
                     : "text-slate-600 hover:bg-slate-50"
               )}
               data-testid="category-all"
            >
               Alle
            </button>
            {categories.map((cat) => category(cat))}
         </div>
      </div>
   );
};
