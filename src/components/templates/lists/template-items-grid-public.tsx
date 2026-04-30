import { isEmpty, map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { PublicTemplateItemCard } from "./items";

type Props = {
   descriptors: DPromptTemplateDescriptor[];
   collections: DCollection[];
};

export const PublicTemplateItemsGrid = ({
   descriptors,
   collections,
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
            />
         ))}
      </div>
   );
};
