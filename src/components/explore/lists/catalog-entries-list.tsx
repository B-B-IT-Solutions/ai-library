import { map } from "es-toolkit/compat";

import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";

import { ExploreEntryCard } from "./items";

type Props = {
   entries: DCatalogEntryWithContent[];
};

export const CatalogEntriesList = ({ entries }: Props) => {
   return (
      <div className="space-y-4" data-testid="catalog-entries-list">
         {map(entries, (entry) => (
            <ExploreEntryCard key={entry.id} entry={entry} />
         ))}
      </div>
   );
};
