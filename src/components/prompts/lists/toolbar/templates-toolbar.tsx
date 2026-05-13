import { FC } from "react";

import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { LibraryFilters } from "./filters";
import { GroupBySelect } from "./group-by";
import { SortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
   filters: DPromptsFilter;
   categories: string[];
   models: string[];
};

export const TemplatesToolbar: FC<Props> = ({
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
         data-testid="templates-toolbar"
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
