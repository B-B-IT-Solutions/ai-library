import { map } from "es-toolkit/compat";

import { DCatalogEntrySummary } from "@/data/types/domain/catalog";

import { ExploreEntryCard } from "./items";

type Props = {
   entries: DCatalogEntrySummary[];
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
