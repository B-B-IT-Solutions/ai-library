import { ListViewToggle } from "@/components/shared/buttons";
import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { LibraryFilters } from "./filters";
import { SortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
   sortBy?: DListSortByMode;
   categories: string[];
   models: string[];
};

export const TemplatesToolbar = ({ viewMode, categories, models }: Props) => {
   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="templates-toolbar"
      >
         <div className="flex items-center gap-4">
            <LibraryFilters categories={categories} models={models} />
            <SortBySelect />
         </div>
         <ListViewToggle currentView={viewMode} />
      </div>
   );
};
