"use client";

import { FC } from "react";
import { ArrowDownAZ, ArrowUpAZ, Clock } from "lucide-react";
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

export const CatalogSortBySelect: FC = () => {
   const [sort, setSort] = useQueryState(
      "sort",
      sortByParam.withOptions({ shallow: false })
   );

   return (
      <Select
         value={sort}
         onValueChange={(value: DListSortByMode) => setSort(value)}
      >
         <SelectTrigger
            className="h-8 w-full sm:w-[170px]"
            data-testid="catalog-sort-by-select"
         >
            <SelectValue />
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
                  <Clock className="h-3.5 w-3.5" />
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
