import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "../item";

type Props = {
   entries: DCatalogEntry[];
   authenticated: boolean;
   ref?: React.Ref<HTMLDivElement>;
};

export const CatalogEntriesGrid = ({ entries, authenticated, ref }: Props) => {
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
      <div
         className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
         data-testid="catalog-entries-grid"
      >
         {entries.map((e, i) => item(e, i))}
      </div>
   );
};
