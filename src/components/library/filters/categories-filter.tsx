"use client";

import { FC } from "react";
import { filter, includes, isEmpty, map } from "es-toolkit/compat";
import { debounce, useQueryState } from "nuqs";

import { Badge } from "@/components/shadcn/badge";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { useLoadLibraryCategories } from "@/data/ts-queries/library";
import { librarySearchParams } from "../search-params";

export const CategoriesFilter: FC = () => {
   const [f_categories, setCategories] = useQueryState(
      "f_categories",
      librarySearchParams["f_categories"]
   );

   const { data: categories = [], isLoading } = useLoadLibraryCategories();

   const toggleCategory = (category: string) => {
      const isSelected = includes(f_categories, category);
      const newCategories = isSelected
         ? filter(f_categories, (c) => c !== category)
         : [...f_categories, category];

      setCategories(newCategories, {
         limitUrlUpdates: debounce(400),
      });
   };

   const badge = () => {
      if (!isEmpty(f_categories)) {
         return (
            <Badge variant="secondary" className="h-5 px-2 text-xs">
               {f_categories.length}
            </Badge>
         );
      }
   };

   const renderCategory = (category: string) => {
      const isSelected = includes(f_categories, category);
      return (
         <div key={category} className="flex items-center space-x-2">
            <Checkbox
               id={`category-${category}`}
               checked={isSelected}
               onCheckedChange={() => toggleCategory(category)}
               data-testid={`category-${category}`}
            />
            <Label
               htmlFor={`category-${category}`}
               className="cursor-pointer text-sm font-normal"
            >
               {category}
            </Label>
         </div>
      );
   };

   if (isLoading) {
      return <div className="text-sm text-slate-500">Lädt...</div>;
   }

   if (isEmpty(categories)) {
      return (
         <div className="text-sm text-slate-500" data-testid="categories-empty">
            Keine Kategorien verfügbar
         </div>
      );
   }

   return (
      <div className="space-y-3" data-testid="categories-filter">
         <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Kategorien</Label>
            {badge()}
         </div>
         <div className="max-h-[200px] space-y-2 overflow-y-auto">
            {map(categories, renderCategory)}
         </div>
      </div>
   );
};
