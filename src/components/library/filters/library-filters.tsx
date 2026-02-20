"use client";

import { FC, useMemo } from "react";
import { isEmpty } from "es-toolkit/compat";
import { Filter, X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

import { CategoriesFilter } from "./categories-filter";
import { ModelsFilter } from "./models-filter";
import { SearchFilter } from "./search-filter";

type Props = {
   filters: DLibraryEntriesFilter;
};

export const LibraryFilters: FC<Props> = ({ filters }) => {
   const hasActiveFilters = useMemo(() => {
      return (
         !isEmpty(filters.search) ||
         !isEmpty(filters.categories) ||
         !isEmpty(filters.models) ||
         !isEmpty(filters.models) ||
         filters.isFavorite
      );
   }, [filters]);

   return (
      <Card className="gap-3 p-4">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Filter className="h-4 w-4 text-slate-600" />
               <h3 className="text-sm font-semibold">Filter</h3>
            </div>
            {hasActiveFilters && (
               <Button
                  variant="ghost"
                  size="sm"
                  // onClick={resetFilters}
                  className="h-8 px-2 text-xs"
               >
                  <X className="mr-1 h-3 w-3" />
                  Zurücksetzen
               </Button>
            )}
         </div>

         <div className="space-y-4">
            <SearchFilter />
            <Separator />
            <CategoriesFilter />
            <Separator />
            <ModelsFilter />
         </div>
      </Card>
   );
};
