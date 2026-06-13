"use client";

import { useQueryState } from "nuqs";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { DWorkflowsSortByMode } from "@/data/types/domain/common";
import { workflowsSearchParams } from "../../workflows-search-params";

export const SortBySelect = () => {
   const [sort, setSort] = useQueryState(
      "sort",
      workflowsSearchParams["sort"]
   );

   return (
      <Select
         value={sort}
         onValueChange={(value: DWorkflowsSortByMode) => setSort(value)}
      >
         <SelectTrigger className="h-8 w-40" data-testid="sort-by-select">
            <SelectValue placeholder="Sortierung" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem
               value={DWorkflowsSortByMode.DATE_DESC}
               data-testid="desc-date"
            >
               Neueste zuerst
            </SelectItem>
            <SelectItem
               value={DWorkflowsSortByMode.DATE_ASC}
               data-testid="asc-date"
            >
               Älteste zuerst
            </SelectItem>
            <SelectItem
               value={DWorkflowsSortByMode.TITLE_ASC}
               data-testid="asc-title"
            >
               Titel A-Z
            </SelectItem>
            <SelectItem
               value={DWorkflowsSortByMode.TITLE_DESC}
               data-testid="desc-title"
            >
               Titel Z-A
            </SelectItem>
         </SelectContent>
      </Select>
   );
};
