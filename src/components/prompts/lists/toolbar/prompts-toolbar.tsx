import { ListViewToggle } from "@/components/shared/buttons";
import { DCollection } from "@/data/types/domain/collection";
import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { PromptFilters } from "./filters";
import { SortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
   sortBy?: DListSortByMode;
   categories: string[];
   models: string[];
   collections: DCollection[];
};

export const PromptsToolbar = ({
   viewMode,
   categories,
   models,
   collections,
}: Props) => {
   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="prompts-toolbar"
      >
         <div className="flex items-center gap-4">
            <PromptFilters
               categories={categories}
               models={models}
               collections={collections}
            />
            <SortBySelect />
         </div>
         <ListViewToggle currentView={viewMode} />
      </div>
   );
};
