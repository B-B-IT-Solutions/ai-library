"use client";

import { FC, useState } from "react";
import { filter, includes, isEmpty, map } from "es-toolkit/compat";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "@/components/shadcn/badge";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";

import { useLibraryEntryFiltersContext } from "./filters-context";

type Props = {
   categories: string[];
};

export const CategoriesFilter: FC<Props> = ({ categories }) => {
   const filtersContext = useLibraryEntryFiltersContext();
   const [f_categories, setCategories] = useState(
      filtersContext.getCategories()
   );

   const updateFiltersContext = useDebouncedCallback((values: string[]) => {
      filtersContext.setCategories(values);
   }, 400);

   const toggleCategory = (category: string) => {
      const isSelected = includes(f_categories, category);
      const newCategories = isSelected
         ? filter(f_categories, (c) => c !== category)
         : [...f_categories, category];

      setCategories(newCategories);
      updateFiltersContext(newCategories);
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
