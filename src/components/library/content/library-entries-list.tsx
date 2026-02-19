import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";

import { DLibraryCollection, DLibraryEntry } from "@/data/types/domain/library";
import { LibraryEntryCard } from "../list/library-entry-card";

type LibraryEntriesListProps = {
   entries: DLibraryEntry[];
   collections: DLibraryCollection[];
};

export const LibraryEntriesList: FC<LibraryEntriesListProps> = ({
   entries,
   collections,
}) => {
   if (isEmpty(entries)) {
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
      <div className="space-y-4" data-testid="library-entries-list">
         {map(entries, (entry) => (
            <LibraryEntryCard
               key={entry.id}
               entry={entry}
               collections={collections}
            />
         ))}
      </div>
   );
};
