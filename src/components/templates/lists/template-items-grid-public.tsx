import { isEmpty, map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { PublicTemplateItemCard } from "./items";

type Props = {
   descriptors: DPrompt[];
   collections: DCollection[];
   collectionToken?: string | null;
};

export const PublicTemplateItemsGrid = ({
   descriptors,
   collections,
   collectionToken,
}: Props) => {
   if (isEmpty(descriptors)) {
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="template-items-empty"
         >
            <p className="text-lg font-medium text-slate-600">
               Keine Vorlagen gefunden
            </p>
            <p className="mt-2 text-sm text-slate-500">
               Versuchen Sie, Ihre Filterkriterien anzupassen
            </p>
         </div>
      );
   }

   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="public-template-items-grid"
      >
         {map(descriptors, (entry) => (
            <PublicTemplateItemCard
               key={entry.id}
               descriptor={entry}
               collections={collections}
               collectionToken={collectionToken}
            />
         ))}
      </div>
   );
};
