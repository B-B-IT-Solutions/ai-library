import { map } from "es-toolkit/compat";

import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "./items";

type Props = {
   entries: DCatalogEntry[];
   authenticated: boolean;
};

export const CatalogEntriesList = ({ entries, authenticated }: Props) => {
   return (
      <div className="space-y-4" data-testid="catalog-entries-list">
         {map(entries, (entry) => (
            <CatalogEntryItem
               key={entry.id}
               entry={entry}
               isAuthenticated={authenticated}
            />
         ))}
      </div>
   );
};
