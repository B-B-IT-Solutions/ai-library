"use client";

import { FC, useState } from "react";
import { cloneDeep } from "es-toolkit";
import {
   concat,
   debounce,
   includes,
   isEqual,
   map,
   remove,
} from "es-toolkit/compat";
import { ChevronsUpDown, Filter, Search, X } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/shadcn/command";
import { Input } from "@/components/shadcn/input";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { useLoadPromptCategories } from "@/data/ts-queries/prompt";
import { cn } from "@/lib/utils";

export type Filters = {
   search?: string;
   categories?: string[];
};

type PromptFiltersProps = {
   onFiltersUpdate: (filters: Filters) => void;
};

export const PromptFilters: FC<PromptFiltersProps> = ({ onFiltersUpdate }) => {
   const [search, setSearch] = useState<string>();
   const [categories, setCategories] = useState<string[]>([]);
   const [open, setOpen] = useState(false);

   const onSearchUpdateDebounnced = debounce((value: string) => {
      setSearch(value);
      onFiltersUpdate({ search: value, categories });
   }, 300);

   console.log(useLoadPromptCategories);

   const { data: loadedCategories = [] } = useLoadPromptCategories();

   console.log(loadedCategories);

   const toggleCategory = (value: string) => {
      if (includes(categories, value)) {
         const newCats = cloneDeep(categories);
         remove(newCats, (prev) => isEqual(prev, value));
         setCategories(newCats);
         onFiltersUpdate({ search, categories: newCats });
      } else {
         const newCats = concat(categories, value);
         setCategories(newCats);
         onFiltersUpdate({ search, categories: newCats });
      }
   };

   const searchInput = () => {
      return (
         <div className="relative mb-4" data-testid="search-input">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
               id="search-prompts"
               type="text"
               placeholder="Search prompts"
               onChange={(e) => onSearchUpdateDebounnced(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
         </div>
      );
   };

   const categoriesComboBox = () => {
      return (
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true} data-testid="categories-combo-box">
               <div>
                  <label className="flex items-center text-sm text-slate-600 mb-2 font-medium">
                     <Filter className="w-4 h-4 mr-2" />
                     Filter by Category
                  </label>
                  <div
                     className={cn(
                        "w-full min-h-10 cursor-pointer rounded-md border border-input bg-background px-2 py-1",
                        "flex items-center flex-wrap gap-2"
                     )}
                  >
                     {categories.length === 0 && (
                        <span className="text-muted-foreground text-sm"></span>
                     )}

                     {map(categories, (cat) => {
                        return (
                           <Badge
                              key={cat}
                              variant="secondary"
                              className="flex items-center gap-1"
                           >
                              {cat}
                              <X
                                 size={12}
                                 className="cursor-pointer"
                                 // onClick={(e) => {
                                 //    e.stopPropagation();
                                 //    toggleCategory(cat);
                                 // }}
                              />
                           </Badge>
                        );
                     })}

                     <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                  </div>
               </div>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
               <Command>
                  <CommandList>
                     <CommandEmpty>No results found.</CommandEmpty>
                     <CommandGroup>
                        {map(loadedCategories, (cat, idx) => (
                           <CommandItem
                              key={idx}
                              onSelect={() => toggleCategory(cat)}
                              className="flex items-center gap-2"
                           >
                              <div
                                 className={cn(
                                    "h-3 w-3 rounded-sm border border-primary",
                                    categories.includes(cat) ? "bg-primary" : ""
                                 )}
                              />
                              {cat}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      );
   };

   return (
      <div
         className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"
         data-testid="prompts-filter"
      >
         {searchInput()}
         {categoriesComboBox()}
      </div>
   );
};
