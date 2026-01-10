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

   const { data: loadedCategories = [] } = useLoadPromptCategories();

   const onSearchUpdate = debounce((value: string) => {
      setSearch(value);
      onFiltersUpdate({ search: value, categories });
   }, 300);

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
         <div className="relative mb-3" data-testid="search-input">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
               id="search-prompts"
               type="text"
               placeholder="Prompts durchsuchen..."
               onChange={(e) => onSearchUpdate(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
            />
         </div>
      );
   };

   const categoriesComboBox = () => {
      return (
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true} data-testid="categories-combo-box">
               <div>
                  <label className="flex items-center text-sm text-slate-700 mb-2 font-semibold">
                     <Filter className="w-4 h-4 mr-2 text-slate-500" />
                     Nach Kategorie filtern
                  </label>
                  <div
                     className={cn(
                        "w-full min-h-[42px] cursor-pointer rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 px-3 py-2",
                        "flex items-center flex-wrap gap-2 transition-all shadow-sm"
                     )}
                  >
                     {categories.length === 0 && (
                        <span className="text-slate-400 text-sm">Kategorien auswählen...</span>
                     )}

                     {map(categories, (cat) => {
                        return (
                           <Badge
                              key={cat}
                              variant="secondary"
                              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-100 px-2.5 py-1"
                           >
                              <span className="font-medium">{cat}</span>
                              <X
                                 size={14}
                                 className="cursor-pointer hover:text-blue-900 transition-colors"
                              />
                           </Badge>
                        );
                     })}

                     <ChevronsUpDown className="ml-auto h-4 w-4 text-slate-400" />
                  </div>
               </div>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 shadow-lg border-slate-200">
               <Command>
                  <CommandList>
                     <CommandEmpty className="py-6 text-sm text-slate-500">
                        Keine Kategorien gefunden.
                     </CommandEmpty>
                     <CommandGroup>
                        {map(loadedCategories, (cat, idx) => (
                           <CommandItem
                              key={idx}
                              onSelect={() => toggleCategory(cat)}
                              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50"
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
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      );
   };

   return (
      <div data-testid="prompts-filter">
         {searchInput()}
         {categoriesComboBox()}
      </div>
   );
};
