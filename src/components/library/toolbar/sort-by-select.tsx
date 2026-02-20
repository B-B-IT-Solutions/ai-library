"use client";

import { FC } from "react";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { DListSortByMode } from "@/data/types/domain/common";
import { useSetUrlSearchParams } from "@/hooks";

type Props = {
   currentSortBy: DListSortByMode;
};

export const SortBySelect: FC<Props> = ({ currentSortBy }) => {
   const { setUrlSearchParams } = useSetUrlSearchParams();

   const updateSortBy = (sortBy: DListSortByMode) => {
      setUrlSearchParams("sort", sortBy);
   };

   return (
      <Select
         value={currentSortBy}
         onValueChange={(value: DListSortByMode) => updateSortBy(value)}
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
