import { Folder, Globe } from "lucide-react";

import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
};

export const PublicCollectionHeader = async ({ collection }: Props) => {
   return (
      <div className="border-b bg-white" data-testid="collection-header-public">
         <div className="container mx-auto max-w-6xl px-4 py-8">
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
                  <div
                     className="flex flex-wrap items-center gap-2"
                     data-testid="public-badge"
                  >
                     <h1 className="text-2xl font-bold text-slate-900">
                        {collection.name}
                     </h1>
                     <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <Globe className="h-3 w-3" />
                        Öffentlich
                     </span>
                  </div>
                  {collection.description && (
                     <p className="mt-1.5 text-slate-500">
                        {collection.description}
                     </p>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
