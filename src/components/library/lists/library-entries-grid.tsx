import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";

import { DLibraryCollection } from "@/data/types/domain/library";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { LibraryEntryCard } from "./items";

type LibraryEntriesGridProps = {
   descriptors: DPromptTemplateDescriptor[];
   collections: DLibraryCollection[];
};

export const LibraryEntriesGrid: FC<LibraryEntriesGridProps> = ({
   descriptors,
   collections,
}) => {
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
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="library-entries-grid"
      >
         {map(descriptors, (entry) => (
            <LibraryEntryCard
               key={entry.id}
               descriptor={entry}
               collections={collections}
            />
         ))}
      </div>
   );
};
