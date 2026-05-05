"use client";

import { filter, includes, isEmpty } from "es-toolkit/compat";
import { Clock, Search, TrendingUp } from "lucide-react";
import { debounce, useQueryState } from "nuqs";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import { DListSortByMode } from "@/data/types/domain/common";
import { cn } from "@/lib/utils";
import {
   f_categoriesParam,
   f_searchParam,
   sortByParam,
} from "../../explore-search-params";

type ExploreFilterBarProps = {
   categories: DCatalogEntryCategory[];
   totalElements: number;
};

export const ExploreFilterBar = ({
   categories,
   totalElements,
}: ExploreFilterBarProps) => {
   const [q, setQ] = useQueryState(
      "search",
      f_searchParam.withOptions({ shallow: false })
   );
   const [f_categories, setFCategories] = useQueryState(
      "f_categories",
      f_categoriesParam.withOptions({ shallow: false })
   );
   const [sort, setSort] = useQueryState(
      "sortBy",
      sortByParam.withOptions({ shallow: false })
   );
   const handleSearchChange = (value: string) => {
      setQ(value);
   };

   const handleCategoryChange = (slug: string) => {
      const isActive = includes(f_categories, slug);
      const newCollectionIds = isActive
         ? filter(f_categories, (id) => id !== slug)
         : [...f_categories, slug];

      setFCategories(newCollectionIds, {
         limitUrlUpdates: debounce(400),
      });
   };

   const handleSortChange = (value: DListSortByMode) => {
      setSort(value);
   };

   const cats = () => {
      return (
         <div
            className="flex flex-wrap gap-2"
            data-testid="explore-category-filter"
         >
            <Button
               variant={isEmpty(f_categories) ? "default" : "outline"}
               size="sm"
               onClick={() => handleCategoryChange("")}
               className="h-7 rounded-full px-3 text-xs"
            >
               Alle ({totalElements})
            </Button>
            {categories.map((cat) => (
               <Button
                  key={cat.id}
                  variant={
                     includes(f_categories, cat.slug) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={cn(
                     "h-7 rounded-full px-3 text-xs",
                     includes(f_categories, cat.slug) && "font-semibold"
                  )}
                  data-testid={`explore-category-pill-${cat.slug}`}
               >
                  {cat.name}
               </Button>
            ))}
         </div>
      );
   };

   return (
      <div className="space-y-4" data-testid="explore-filter-bar">
         <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
               <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
               <Input
                  data-testid="explore-search-input"
                  placeholder="Vorlagen durchsuchen…"
                  value={q}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
               />
            </div>

            {/* Sort */}
            <Select value={sort} onValueChange={handleSortChange}>
               <SelectTrigger
                  className="w-full sm:w-44"
                  data-testid="explore-sort-select"
               >
                  <SelectValue />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value={DListSortByMode.DATE_DESC}>
                     <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Neueste
                     </span>
                  </SelectItem>
                  <SelectItem value={DListSortByMode.TITLE_ASC}>
                     <span className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Beliebteste
                     </span>
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>

         {cats()}
      </div>
   );
};
