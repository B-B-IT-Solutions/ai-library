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
import { DListSortByMode } from "@/data/types/domain/common";
import { librarySearchParams } from "../../../search-params";

export const SortBySelect: FC = () => {
   const [group, setGroup] = useQueryState("sort", librarySearchParams["sort"]);

   return (
      <Select
         value={group}
         onValueChange={(value: DListSortByMode) => setGroup(value)}
      >
         <SelectTrigger className="h-8 w-[180px]" data-testid="sort-by-select">
            <SelectValue placeholder="Sortierung" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem
               value={DListSortByMode.DATE_DESC}
               data-testid="date-desc"
            >
               Neueste zuerst
            </SelectItem>
            <SelectItem value={DListSortByMode.DATE_ASC} data-testid="date-asc">
               Älteste zuerst
            </SelectItem>
            <SelectItem value={DListSortByMode.NAME_ASC} data-testid="name-asc">
               Name A-Z
            </SelectItem>
            <SelectItem
               value={DListSortByMode.NAME_DESC}
               data-testid="name-desc"
            >
               Name Z-A
            </SelectItem>
         </SelectContent>
      </Select>
   );
};
