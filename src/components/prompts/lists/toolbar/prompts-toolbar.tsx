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
         <div className="sm:w-64">
            <SearchFilter />
         </div>
         <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
               <PromptFilters
                  categories={categories}
                  models={models}
                  collections={collections}
               />
               <SortBySelect />
            </div>
            <ListViewToggle currentView={viewMode} />
         </div>
      </div>
   );
};
