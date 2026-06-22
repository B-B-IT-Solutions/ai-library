"use client";

import { FC } from "react";
import { useQueryState } from "nuqs";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { DCollectionsSortByMode } from "@/data/types/domain/common";
import { collectionsSearchParams } from "../../../collections-search-params";

export const SortBySelect: FC = () => {
   const [sort, setSort] = useQueryState(
      "sort",
      collectionsSearchParams["sort"]
   );

   return (
      <Select
         value={sort}
         onValueChange={(value: DCollectionsSortByMode) => setSort(value)}
      >
         <SelectTrigger className="h-8 w-full sm:w-40" data-testid="sort-by-select">
            <SelectValue placeholder="Sortierung" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem
               value={DCollectionsSortByMode.NAME_ASC}
               data-testid="asc-name"
            >
               Name A-Z
            </SelectItem>
            <SelectItem
               value={DCollectionsSortByMode.NAME_DESC}
               data-testid="desc-name"
            >
               Name Z-A
            </SelectItem>
            <SelectItem
               value={DCollectionsSortByMode.DATE_DESC}
               data-testid="desc-date"
            >
               Neueste zuerst
            </SelectItem>
            <SelectItem
               value={DCollectionsSortByMode.DATE_ASC}
               data-testid="asc-date"
            >
               Älteste zuerst
            </SelectItem>
         </SelectContent>
      </Select>
   );
};
