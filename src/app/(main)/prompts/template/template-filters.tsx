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

   const removeTag = (value: string) => {
      toggleOption(value);
   };

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
               type="text"
               placeholder="Search templates"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
         </div>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={true}>
               <div
                  className={cn(
                     "w-full min-h-10 cursor-pointer rounded-md border border-input bg-background px-2 py-1",
                     "flex items-center flex-wrap gap-2"
                  )}
                  onClick={() => setOpen(true)}
               >
                  {categories.length === 0 && (
                     <span className="text-muted-foreground text-sm">
                        Select cateory
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
                                 console.log("clicked");
                                 e.stopPropagation();
                                 removeTag(cat);
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
                        {loadedCategories.map((cat) => (
                           <CommandItem
                              key={cat}
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
      </div>
   );
};
