import { map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";

import { CollectionItem } from "./items";

type Props = {
   collections: DCollection[];
   ref?: React.Ref<HTMLDivElement>;
};

export const CollectionItemsGrid = ({ collections, ref }: Props) => {
   const item = (collection: DCollection, index: number) => {
      const isLast = index === collections.length - 1;
      return (
         <CollectionItem
            key={collection.id}
            collection={collection}
            ref={isLast ? ref : undefined}
         />
      );
   };

   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="collection-items-grid"
      >
         {map(collections, (c, i) => item(c, i))}
      </div>
   );
};
