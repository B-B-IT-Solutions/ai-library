import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "./items";

type Props = {
   entries: DCatalogEntry[];
   authenticated: boolean;
   ref?: React.Ref<HTMLDivElement>;
};

export const CatalogEntriesGrid = ({ entries, authenticated, ref }: Props) => {
   return (
      <div
         className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
         data-testid="catalog-entries-grid"
      >
         {entries.map((entry, index) => (
            <CatalogEntryItem
               key={entry.id}
               entry={entry}
               isAuthenticated={authenticated}
               ref={index === entries.length - 1 ? ref : undefined}
            />
         ))}
      </div>
   );
};
