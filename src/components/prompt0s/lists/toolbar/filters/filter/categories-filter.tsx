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
import { useLoadPromptCategories } from "@/data/ts-queries/prompt0";
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
            className="flex items-center gap-1.5 border border-blue-200 bg-linear-to-r from-blue-50 to-blue-100 px-2.5 py-1 text-blue-700 hover:bg-blue-100"
            data-testid={`selected-category-${toTestId(cat)}`}
         >
            <span className="font-medium">{cat}</span>
            <X
               size={14}
               className="cursor-pointer transition-colors hover:text-blue-900"
            />
         </Badge>
      );
   };

   const renderSelectedCategories = () => {
      return (
         <div
            className={cn(
               "min-h-10.5 w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 hover:border-slate-300 hover:bg-white",
               "flex flex-wrap items-center gap-2 shadow-sm transition-all"
            )}
         >
            {isEmpty(categories) && (
               <span
                  className="text-sm text-slate-400"
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
            className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50"
            data-testid={`category-option-${toTestId(cat)}`}
         >
            <div
               className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border-2 transition-all",
                  categories.includes(cat)
                     ? "border-blue-600 bg-blue-600"
                     : "border-slate-300"
               )}
            >
               {categories.includes(cat) && (
                  <div className="h-2 w-2 rounded-sm bg-white" />
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
            className="text-xs font-semibold tracking-wide text-slate-700 uppercase"
            data-testid="filter-label"
         >
            Kategorien
         </label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true} data-testid="popover-trigger">
               {renderSelectedCategories()}
            </PopoverTrigger>
            <PopoverContent className="w-72 border-slate-200 p-0 shadow-lg">
               {renderCategoryOptions()}
            </PopoverContent>
         </Popover>
      </div>
   );
};
