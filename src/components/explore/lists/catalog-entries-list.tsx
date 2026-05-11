import { map } from "es-toolkit/compat";

import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "./items";

type Props = {
   entries: DCatalogEntry[];
   authenticated: boolean;
   ref?: React.Ref<HTMLDivElement>;
};

export const CatalogEntriesList = ({ entries, authenticated, ref }: Props) => {
   const item = (entry: DCatalogEntry, index: number) => {
      const isLast = index === entries.length - 1;
      return (
         <CatalogEntryItem
            key={entry.id}
            entry={entry}
            isAuthenticated={authenticated}
            ref={isLast ? ref : undefined}
         />
      );
   };

   return (
      <div className="space-y-4" data-testid="catalog-entries-list">
         {map(entries, (e, i) => item(e, i))}
      </div>
   );
};
