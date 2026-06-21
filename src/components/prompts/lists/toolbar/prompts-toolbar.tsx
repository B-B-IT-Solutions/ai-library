import { ListViewToggle } from "@/components/shared/buttons";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { PromptFilters } from "./filters";
import { SearchFilter } from "./filters/search-filter";
import { SortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
   sortBy?: DListSortByMode;
   categories: string[];
   models: string[];
   collections: DCollectionPreview[];
};

export const PromptsToolbar = ({
   viewMode,
   categories,
   models,
   collections,
}: Props) => {
   return (
      <div
         className="flex flex-col gap-2 border-b bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
         data-testid="prompts-toolbar"
      >
         <div className="flex flex-col gap-2 sm:flex-row">
            <div className="sm:w-64">
               <SearchFilter />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="flex-1 sm:flex-none">
                  <PromptFilters
                     categories={categories}
                     models={models}
                     collections={collections}
                  />
               </div>
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
