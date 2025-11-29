"use client";

import { FC, useState } from "react";
import { cloneDeep } from "es-toolkit";
import { concat, includes, isEqual, map, remove } from "es-toolkit/compat";
import { ChevronsUpDown, Search, X } from "lucide-react";

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
import { cn } from "@/lib/utils";

type TemplateFiltersProps = {
   loadedCategories: string[];
   search: string;
   categories: string[];
   setSearch: (value: string) => void;
   setCategories: (value: string[]) => void;
};

export const TemplateFilters: FC<TemplateFiltersProps> = ({
   loadedCategories,
   search,
   setSearch,
   categories,
   setCategories,
}) => {
   const [open, setOpen] = useState(false);

   const toggleOption = (value: string) => {
      if (includes(categories, value)) {
         const newCats = cloneDeep(categories);
         remove(newCats, (prev) => isEqual(prev, value));
         setCategories(newCats);
      } else {
         const newCats = concat(categories, value);
         setCategories(newCats);
      }
   };

   // const handleSearch = (value: string) => {
   //    debounce(() => {
   //       console.log("called");
   //       setSearch(value);
   //    }, 300);
   // };

   const searchInput = () => {
      return (
         <div className="relative" data-testid="search-input">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
               id="search-templates"
               type="text"
               placeholder="Search templates"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full min-h-10 pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
         </div>
      );
   };

   const categoriesComboBox = () => {
      return (
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true} data-testid="categories-combo-box">
               <div
                  className={cn(
                     "w-full min-h-10 cursor-pointer rounded-md border border-input bg-background px-2 py-1",
                     "flex items-center flex-wrap gap-2"
                  )}
                  onClick={() => setOpen(true)}
               >
                  {categories.length === 0 && (
                     <span className="text-muted-foreground text-sm">
                        Select category
                     </span>
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
                              onClick={(e) => {
                                 e.stopPropagation();
                                 toggleOption(cat);
                              }}
                           />
                        </Badge>
                     );
                  })}

                  <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
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
                              onSelect={() => toggleOption(cat)}
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
         className="grid grid-cols-1 md:grid-cols-2 gap-3"
         data-testid="template-filters"
      >
         {searchInput()}
         {categoriesComboBox()}
      </div>
   );
};
