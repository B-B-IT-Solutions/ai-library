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
import { DListGroupByMode } from "@/data/types/domain/common";
import { templatesSearchParams } from "../../../search-params";

export const GroupBySelect: FC = () => {
   const [group, setGroup] = useQueryState(
      "group",
      templatesSearchParams["group"]
   );

   return (
      <Select
         value={group}
         onValueChange={(value: DListGroupByMode) => setGroup(value)}
      >
         <SelectTrigger className="h-8 w-[180px]" data-testid="group-by-select">
            <SelectValue placeholder="Gruppierung" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value={DListGroupByMode.NONE} data-testid="none">
               Keine Gruppierung
            </SelectItem>
            <SelectItem
               value={DListGroupByMode.CATEGORY}
               data-testid="category"
            >
               Nach Kategorie
            </SelectItem>
            <SelectItem value={DListGroupByMode.MODEL} data-testid="model">
               Nach Modell
            </SelectItem>
            <SelectItem value={DListGroupByMode.DATE} data-testid="date">
               Nach Datum
            </SelectItem>
         </SelectContent>
      </Select>
   );
};
