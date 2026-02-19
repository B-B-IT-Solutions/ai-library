import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";

import { DLibraryEntry } from "@/data/types/domain/library";
import { LibraryEntryCard } from "../list/library-entry-card";

type LibraryEntriesGridProps = {
   entries: DLibraryEntry[];
};

export const LibraryEntriesGrid: FC<LibraryEntriesGridProps> = ({
   entries,
}) => {
   if (isEmpty(entries)) {
      return (
         <div className="flex flex-col items-center justify-center py-16 text-center">
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {map(entries, (entry) => (
            <LibraryEntryCard key={entry.id} entry={entry} />
         ))}
      </div>
   );
};
