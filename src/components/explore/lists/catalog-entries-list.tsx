import { map } from "es-toolkit/compat";

import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "./items";

type Props = {
   entries: DCatalogEntry[];
   authenticated: boolean;
   ref?: React.Ref<HTMLDivElement>;
};

export const CatalogEntriesList = ({ entries, authenticated, ref }: Props) => {
   return (
      <div className="space-y-4" data-testid="catalog-entries-list">
         {map(entries, (entry, index) => (
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
