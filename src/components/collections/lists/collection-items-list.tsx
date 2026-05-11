import { map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";

import { CollectionCard } from "./items";

type Props = {
   collections: DCollection[];
   ref?: React.Ref<HTMLDivElement>;
};

export const CollectionItemsList = ({ collections, ref }: Props) => {
   return (
      <div ref={ref} className="space-y-4" data-testid="collection-items-list">
         {map(collections, (c) => (
            <CollectionCard key={c.id} collection={c} />
         ))}
      </div>
   );
};
