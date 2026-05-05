import { DCatalogEntrySummary } from "@/data/types/domain/catalog";

import { ExploreEmptyState } from "./explore-empty-state";
import { ExploreEntryCard } from "./items";

type ExploreEntryGridProps = {
   entries: DCatalogEntrySummary[];
};

export const ExploreEntryGrid = ({ entries }: ExploreEntryGridProps) => {
   if (entries.length === 0) {
      return <ExploreEmptyState />;
   }

   return (
      <div
         className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
         data-testid="explore-entry-grid"
      >
         {entries.map((entry) => (
            <ExploreEntryCard key={entry.id} entry={entry} />
         ))}
      </div>
   );
};
