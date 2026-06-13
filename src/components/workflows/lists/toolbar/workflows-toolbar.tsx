import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";

import { SearchFilter } from "./filters";
import { SortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
};

export const WorkflowsToolbar = ({ viewMode }: Props) => {
   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="workflows-toolbar"
      >
         <div className="flex items-center gap-3">
            <div className="w-64">
               <SearchFilter />
            </div>
            <SortBySelect />
         </div>
         <ListViewToggle currentView={viewMode} />
      </div>
   );
};
