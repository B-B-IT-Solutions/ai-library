import { map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";

import { CollectionCard } from "./items";

type Props = {
   collections: DCollection[];
};

export const CollectionItemsList = ({ collections }: Props) => {
   return (
      <div className="space-y-4" data-testid="collection-items-list">
         {map(collections, (c) => (
            <CollectionCard key={c.id} collection={c} />
         ))}
      </div>
   );
};
