import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "./items";

type Props = {
   entries: DCatalogEntry[];
};

export const CatalogEntriesGrid = ({ entries }: Props) => {
   return (
      <div
         className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
         data-testid="catalog-entries-grid"
      >
         {entries.map((entry) => (
            <CatalogEntryItem key={entry.id} entry={entry} />
         ))}
      </div>
   );
};
