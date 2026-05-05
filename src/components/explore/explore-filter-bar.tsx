"use client";

import { useQueryState } from "nuqs";
import { Search, TrendingUp, Clock } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
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
import { cn } from "@/lib/utils";

import {
   categoryParam,
   pageParam,
   qParam,
   sortParam,
} from "./explore-search-params";

type ExploreFilterBarProps = {
   categories: DCatalogEntryCategory[];
   totalElements: number;
};

export const ExploreFilterBar = ({
   categories,
   totalElements,
}: ExploreFilterBarProps) => {
   const [q, setQ] = useQueryState("q", qParam.withOptions({ shallow: false }));
   const [category, setCategory] = useQueryState(
      "category",
      categoryParam.withOptions({ shallow: false })
   );
   const [sort, setSort] = useQueryState(
      "sort",
      sortParam.withOptions({ shallow: false })
   );
   const [, setPage] = useQueryState(
      "page",
      pageParam.withOptions({ shallow: false })
   );

   const resetPage = () => setPage(0);

   const handleSearchChange = (value: string) => {
      setQ(value);
      resetPage();
   };

   const handleCategoryChange = (slug: string) => {
      setCategory(slug === category ? "" : slug);
      resetPage();
   };

   const handleSortChange = (value: string) => {
      setSort(value as "newest" | "popular");
      resetPage();
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
                  <SelectItem value="newest">
                     <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Neueste
                     </span>
                  </SelectItem>
                  <SelectItem value="popular">
                     <span className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Beliebteste
                     </span>
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* Category pills */}
         {categories.length > 0 && (
            <div
               className="flex flex-wrap gap-2"
               data-testid="explore-category-filter"
            >
               <Button
                  variant={category === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange("")}
                  className="h-7 rounded-full px-3 text-xs"
               >
                  Alle ({totalElements})
               </Button>
               {categories.map((cat) => (
                  <Button
                     key={cat.id}
                     variant={category === cat.slug ? "default" : "outline"}
                     size="sm"
                     onClick={() => handleCategoryChange(cat.slug)}
                     className={cn(
                        "h-7 rounded-full px-3 text-xs",
                        category === cat.slug && "font-semibold"
                     )}
                     data-testid={`explore-category-pill-${cat.slug}`}
                  >
                     {cat.name}
                  </Button>
               ))}
            </div>
         )}
      </div>
   );
};
