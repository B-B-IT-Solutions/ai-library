import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";

import { SearchFilter } from "./filters/search-filter";
import { SortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
};

export const CollectionsToolbar = ({ viewMode }: Props) => {
   return (
      <div
         className="flex flex-col gap-2 border-b bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
         data-testid="collections-toolbar"
      >
         <div className="flex flex-col gap-2 sm:flex-row">
            <div className="sm:w-64">
               <SearchFilter />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="flex-1 sm:flex-none">
                  <SortBySelect />
               </div>
            </div>
         </div>
         <div className="hidden sm:block">
            <ListViewToggle currentView={viewMode} />
         </div>
      </div>
   );
};
