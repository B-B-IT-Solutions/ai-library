import { Folder, Globe } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
};

export const PublicCollectionHeader = ({ collection }: Props) => {
   return (
      <div data-testid="collection-header-public">
         <div className="flex items-center gap-5" data-testid="overview">
            <div
               className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
               style={{ backgroundColor: `${collection.color}20` }}
            >
               <Folder
                  className="h-7 w-7"
                  style={{ color: collection.color }}
               />
            </div>
            <div className="min-w-0 flex-1">
               <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                     {collection.name}
                  </h1>
                  <Badge
                     variant="outline"
                     className="gap-1 border-green-300 bg-green-50 text-green-700"
                     data-testid="public-badge"
                  >
                     <Globe className="h-3 w-3" />
                     Öffentlich
                  </Badge>
               </div>
               {collection.description && (
                  <p className="mt-1.5 text-slate-500">
                     {collection.description}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};
