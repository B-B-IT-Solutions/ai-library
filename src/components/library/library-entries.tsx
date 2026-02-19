import { FC } from "react";
import { map } from "es-toolkit/compat";

import { LibraryEntryCard } from "@/components/library/list/library-entry-card";
import { DLibraryEntry } from "@/data/types/domain/library";

type LibraryProps = {
   entries: DLibraryEntry[];
};

export const LibraryEntries: FC<LibraryProps> = ({ entries }) => {
   return (
      <div
         className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
         data-testid="library-entries"
      >
         {map(entries, (entry) => (
            <LibraryEntryCard key={entry.id} entry={entry} collections={[]} />
         ))}
      </div>
   );
};
