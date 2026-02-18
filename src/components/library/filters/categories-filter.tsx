"use client";

import { FC } from "react";

import { useLoadLibraryCategories } from "@/data/ts-queries/library";
import { Badge } from "@/components/shadcn/badge";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";

import { useLibraryFilters } from "./library-filters-context";

export const CategoriesFilter: FC = () => {
   const context = useLibraryFilters();
   const { data: categories = [], isLoading } = useLoadLibraryCategories();

   const selectedCategories = context.filters.categories || [];

   const toggleCategory = (category: string) => {
      const newCategories = selectedCategories.includes(category)
         ? selectedCategories.filter((c) => c !== category)
         : [...selectedCategories, category];

      context.setFilters({
         categories: newCategories.length > 0 ? newCategories : undefined,
      });
   };

   if (isLoading) {
      return <div className="text-sm text-slate-500">Lädt...</div>;
   }

   if (categories.length === 0) {
      return (
         <div className="text-sm text-slate-500">Keine Kategorien verfügbar</div>
      );
   }

   return (
      <div className="space-y-3">
         <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Kategorien</Label>
            {selectedCategories.length > 0 && (
               <Badge variant="secondary" className="h-5 px-2 text-xs">
                  {selectedCategories.length}
               </Badge>
            )}
         </div>
         <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {categories.map((category) => {
               const isSelected = selectedCategories.includes(category);
               return (
                  <div key={category} className="flex items-center space-x-2">
                     <Checkbox
                        id={`category-${category}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleCategory(category)}
                     />
                     <Label
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal cursor-pointer"
                     >
                        {category}
                     </Label>
                  </div>
               );
            })}
         </div>
      </div>
   );
};
