"use client";

import { FC } from "react";
import { ArrowDownAZ, ArrowUpAZ, Clock, ClockArrowDown } from "lucide-react";
import { useQueryState } from "nuqs";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { DListSortByMode } from "@/data/types/domain/common";
import { sortByParam } from "../../../catalog-search-params";

const SORT_ICONS: Record<DListSortByMode, FC<{ className?: string }>> = {
   [DListSortByMode.DATE_DESC]: Clock,
   [DListSortByMode.DATE_ASC]: ClockArrowDown,
   [DListSortByMode.TITLE_ASC]: ArrowDownAZ,
   [DListSortByMode.TITLE_DESC]: ArrowUpAZ,
};

export const CatalogSortBySelect = () => {
   const [sort, setSort] = useQueryState(
      "sort",
      sortByParam.withOptions({ shallow: false })
   );

   const SortIcon = SORT_ICONS[sort];

   return (
      <Select
         value={sort}
         onValueChange={(value: DListSortByMode) => setSort(value)}
      >
         <SelectTrigger
            className="h-9 w-full sm:h-8 sm:w-[170px]"
            data-testid="catalog-sort-by-select"
         >
            <SortIcon
               className="h-4 w-4 sm:hidden"
               data-testid="sort-mobile-icon"
            />
            <span className="hidden sm:contents">
               <SelectValue />
            </span>
         </SelectTrigger>
         <SelectContent>
            <SelectItem
               value={DListSortByMode.DATE_DESC}
               data-testid="sort-date-desc"
            >
               <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Neueste zuerst
               </span>
            </SelectItem>
            <SelectItem
               value={DListSortByMode.DATE_ASC}
               data-testid="sort-date-asc"
            >
               <span className="flex items-center gap-2">
                  <ClockArrowDown className="h-3.5 w-3.5" />
                  Älteste zuerst
               </span>
            </SelectItem>
            <SelectItem
               value={DListSortByMode.TITLE_ASC}
               data-testid="sort-title-asc"
            >
               <span className="flex items-center gap-2">
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                  Titel A–Z
               </span>
            </SelectItem>
            <SelectItem
               value={DListSortByMode.TITLE_DESC}
               data-testid="sort-title-desc"
            >
               <span className="flex items-center gap-2">
                  <ArrowUpAZ className="h-3.5 w-3.5" />
                  Titel Z–A
               </span>
            </SelectItem>
         </SelectContent>
      </Select>
   );
};
