import { isEmpty, map } from "es-toolkit/compat";

import { DLibraryCollection } from "@/data/types/domain/library";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { LibraryEntryCard } from "./items";

type Props = {
   descriptors: DPromptTemplateDescriptor[];
   collections: DLibraryCollection[];
};

export const TemplateItemsList = ({ descriptors, collections }: Props) => {
   if (isEmpty(descriptors)) {
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="library-entries-empty"
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
      <div className="space-y-4" data-testid="template-items-list">
         {map(descriptors, (descriptor) => (
            <LibraryEntryCard
               key={descriptor.id}
               descriptor={descriptor}
               collections={collections}
            />
         ))}
      </div>
   );
};
