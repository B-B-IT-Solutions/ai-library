"use client";

import { FC, useContext, useState } from "react";
import { cloneDeep } from "es-toolkit";
import {
   concat,
   includes,
   isEmpty,
   isEqual,
   map,
   remove,
} from "es-toolkit/compat";
import { ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/shadcn/command";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { useLoadPromptCategories } from "@/data/ts-queries/prompt";
import { cn, toTestId } from "@/lib/utils";
import { FiltersContext } from "../context";

export const CategoriesFilter: FC = () => {
   const [open, setOpen] = useState(false);
   const { data: categoryOptions = [] } = useLoadPromptCategories();

   const filtersContext = useContext(FiltersContext);

   if (!filtersContext) {
      return null;
   }
   const { filters, setFilters } = filtersContext;
   const { categories = [] } = filters;

   const setCategories = (newCategories: string[]) => {
      setFilters({ ...filters, categories: newCategories });
   };

   const toggleCategory = (value: string) => {
      if (includes(categories, value)) {
         const newCats = cloneDeep(categories);
         remove(newCats, (prev) => isEqual(prev, value));
         setCategories(newCats);
      } else {
         const newCats = concat(categories, value);
         setCategories(newCats);
      }
   };

   const renderSelectedCategory = (cat: string) => {
      return (
         <Badge
            key={cat}
            variant="secondary"
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-100 px-2.5 py-1"
            data-testid={`selected-category-${toTestId(cat)}`}
         >
            <span className="font-medium">{cat}</span>
            <X
               size={14}
               className="cursor-pointer hover:text-blue-900 transition-colors"
            />
         </Badge>
      );
   };

   const renderSelectedCategories = () => {
      return (
         <div
            className={cn(
               "w-full min-h-[42px] cursor-pointer rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 px-3 py-2",
               "flex items-center flex-wrap gap-2 transition-all shadow-sm"
            )}
         >
            {isEmpty(categories) && (
               <span
                  className="text-slate-400 text-sm"
                  data-testid="no-selected-category"
               >
                  Kategorien auswählen...
               </span>
            )}
            {map(categories, (cat) => renderSelectedCategory(cat))}
            <ChevronsUpDown className="ml-auto h-4 w-4 text-slate-400" />
         </div>
      );
   };

   const renderCategoryOption = (cat: string, idx: number) => {
      return (
         <CommandItem
            key={idx}
            onSelect={() => toggleCategory(cat)}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50"
            data-testid={`category-option-${toTestId(cat)}`}
         >
            <div
               className={cn(
                  "h-4 w-4 rounded border-2 transition-all flex items-center justify-center",
                  categories.includes(cat)
                     ? "bg-blue-600 border-blue-600"
                     : "border-slate-300"
               )}
            >
               {categories.includes(cat) && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
               )}
            </div>
            <span className="text-sm font-medium text-slate-700">{cat}</span>
         </CommandItem>
      );
   };

   const renderCategoryOptions = () => {
      return (
         <Command>
            <CommandList data-testid="category-options">
               <CommandEmpty
                  className="py-6 text-sm text-slate-500"
                  data-testid="category-options-empty"
               >
                  Keine Kategorien gefunden.
               </CommandEmpty>
               <CommandGroup>
                  {map(categoryOptions, (cat, idx) =>
                     renderCategoryOption(cat, idx)
                  )}
               </CommandGroup>
            </CommandList>
         </Command>
      );
   };

   return (
      <div className="space-y-2" data-testid="categories-filter">
         <label
            className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
            data-testid="filter-label"
         >
            Kategorien
         </label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true} data-testid="popover-trigger">
               {renderSelectedCategories()}
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 shadow-lg border-slate-200">
               {renderCategoryOptions()}
            </PopoverContent>
         </Popover>
      </div>
   );
};
