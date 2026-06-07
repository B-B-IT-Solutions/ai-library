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
import { templatesSearchParams } from "../../../search-params";

export const SortBySelect: FC = () => {
   const [group, setGroup] = useQueryState(
      "sort",
      templatesSearchParams["sort"]
   );

   return (
      <Select
         value={group}
         onValueChange={(value: DListSortByMode) => setGroup(value)}
      >
         <SelectTrigger className="h-8 w-40" data-testid="sort-by-select">
            <SelectValue placeholder="Sortierung" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem
               value={DListSortByMode.TITLE_ASC}
               data-testid="asc-title"
            >
               Title A-Z
            </SelectItem>
            <SelectItem
               value={DListSortByMode.TITLE_DESC}
               data-testid="desc-title"
            >
               Title Z-A
            </SelectItem>
            <SelectItem
               value={DListSortByMode.DATE_DESC}
               data-testid="desc-date"
            >
               Neueste zuerst
            </SelectItem>
            <SelectItem value={DListSortByMode.DATE_ASC} data-testid="asc-date">
               Älteste zuerst
            </SelectItem>
         </SelectContent>
      </Select>
   );
};
