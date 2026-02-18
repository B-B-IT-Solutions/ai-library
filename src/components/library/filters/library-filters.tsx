"use client";

import { Filter, X } from "lucide-react";
import { FC } from "react";

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";

import { useLibraryFilters } from "./library-filters-context";
import { CategoriesFilter } from "./categories-filter";
import { ModelsFilter } from "./models-filter";
import { SearchFilter } from "./search-filter";

export const LibraryFilters: FC = () => {
   const { resetFilters, hasActiveFilters } = useLibraryFilters();

   return (
      <Card className="p-4 space-y-4">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Filter className="h-4 w-4 text-slate-600" />
               <h3 className="font-semibold text-sm">Filter</h3>
            </div>
            {hasActiveFilters && (
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 px-2 text-xs"
               >
                  <X className="h-3 w-3 mr-1" />
                  Zurücksetzen
               </Button>
            )}
         </div>

         <Separator />

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
