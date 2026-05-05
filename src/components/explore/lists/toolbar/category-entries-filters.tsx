"use client";

import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

import { Input } from "@/components/shadcn/input";
import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";
import { f_searchParam } from "../../catalog-search-params";

import { CatalogSortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
};

export const CatalogEntriesToolbar = ({ viewMode }: Props) => {
   const [q, setQ] = useQueryState(
      "f_search",
      f_searchParam.withOptions({ shallow: false })
   );

   return (
      <div
         className="mb-4 flex items-center justify-between rounded-xl border bg-white px-5 py-3 shadow-sm"
         data-testid="catalog-entries-toolbar"
      >
         <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
               data-testid="explore-search-input"
               placeholder="Suchen…"
               value={q || ""}
               onChange={(e) => setQ(e.target.value || null)}
               className="h-8 w-48 pl-9 text-sm sm:w-64"
            />
         </div>

         <div className="flex items-center gap-3">
            <CatalogSortBySelect />
            <ListViewToggle currentView={viewMode} />
         </div>
      </div>
   );
};
