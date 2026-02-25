import { FC } from "react";

import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";
import { LibraryFilters } from "../list/filters/library-filters";

import { GroupBySelect } from "./group-by-select";
import { SortBySelect } from "./sort-by-select";

type Props = {
   viewMode: DListViewMode;
   filters: DLibraryEntriesFilter;
   categories: string[];
   models: string[];
};

export const LibraryToolbar: FC<Props> = ({
   viewMode,
   filters,
   categories,
   models,
}) => {
   // const { data } = useInfiniteLoadLibraryEntries({
   //    filters,
   // });

   // const totalEntries = useMemo(() => {
   //    if (!data?.pages) return 0;
   //    const firstPage = data.pages[0];
   //    return firstPage?.totalEntries || 0;
   // }, [data]);

   const totalEntries = 1;

   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="library-toolbar"
      >
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />
            <LibraryFilters categories={categories} models={models} />
            <GroupBySelect />
            <SortBySelect />
         </div>

         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Vorlage" : "Vorlagen"}
         </span>
      </div>
   );
};
