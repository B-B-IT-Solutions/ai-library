import { Folder, Globe } from "lucide-react";

import { TemplateItems } from "@/components/templates/lists";
import { DCollection } from "@/data/types/domain/collection";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

type Props = {
   collection: DCollection;
};

export const PublicCollectionView = async ({ collection }: Props) => {
   const iconColor = collection.color;

   return (
      <div className="min-h-full bg-slate-50">
         <div
            className="border-b bg-white px-6 py-8"
            data-testid="collection-public-view"
         >
            <div className="mx-auto max-w-5xl">
               <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${iconColor}20` }}
                     >
                        <Folder
                           className="h-6 w-6"
                           style={{ color: iconColor }}
                        />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <h1 className="text-2xl font-bold text-slate-900">
                              {collection.name}
                           </h1>
                           <Globe className="h-4 w-4 text-green-600" />
                        </div>
                        {collection.description && (
                           <p className="mt-1 text-slate-500">
                              {collection.description}
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto px-8 py-6">
            <TemplateItems
               viewMode={DListViewMode.GRID}
               groupBy={DListGroupByMode.NONE}
               sortBy={DListSortByMode.DATE_ASC}
               filters={{}}
            />
         </div>
      </div>
   );
};
