import { map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";

import { CollectionCard } from "./items";

type Props = {
   collections: DCollection[];
   ref?: React.Ref<HTMLDivElement>;
};

export const CollectionItemsGrid = ({ collections, ref }: Props) => {
   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="collection-items-grid"
      >
         {map(collections, (c, index) => (
            <CollectionCard
               key={c.id}
               collection={c}
               ref={index === collections.length - 1 ? ref : undefined}
            />
         ))}
      </div>
   );
};
