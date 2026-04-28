import { Globe } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { CreateTemplateButton } from "@/components/templates/buttons";
import { DCollection } from "@/data/types/domain/collection";
import { CollectionBreadcrumb } from "../../breadcrumbs";
import { MoreOptionsButton } from "../../buttons";

type Props = {
   collection: DCollection;
};

export const CollectionHeader = ({ collection }: Props) => {
   return (
      <div
         className="flex justify-between gap-4"
         data-testid="collection-header"
      >
         <div>
            <CollectionBreadcrumb variant="view" label={collection.name} />
            <div className="mt-3 min-w-0" data-testid="overview">
               <div className="flex items-center gap-2">
                  <h1 className="truncate text-2xl font-bold text-slate-900">
                     {collection.name}
                  </h1>
                  {collection.isPublic && (
                     <Badge
                        variant="outline"
                        className="gap-1 border-green-300 bg-green-50 text-green-700"
                        data-testid="public-badge"
                     >
                        <Globe className="h-3 w-3" />
                        Öffentlich
                     </Badge>
                  )}
               </div>
               {collection.description && (
                  <p className="mt-1 text-sm text-slate-600">
                     {collection.description}
                  </p>
               )}
            </div>
         </div>

         <div
            className="flex shrink-0 items-center gap-2"
            data-testid="actions"
         >
            <CreateTemplateButton />
            <MoreOptionsButton collection={collection} />
         </div>
      </div>
   );
};
