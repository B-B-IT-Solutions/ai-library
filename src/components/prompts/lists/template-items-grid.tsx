import { map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { TemplateItemCard } from "./items";

type Props = {
   descriptors: DPrompt[];
   collections: DCollection[];
   collectionId?: string;
   ref?: React.Ref<HTMLDivElement>;
};

export const TemplateItemsGrid = ({
   descriptors,
   collections,
   collectionId,
   ref,
}: Props) => {
   const item = (descriptor: DPrompt, index: number) => {
      const isLast = index === descriptors.length - 1;
      return (
         <TemplateItemCard
            key={descriptor.id}
            prompt={descriptor}
            collections={collections}
            collectionId={collectionId}
            ref={isLast ? ref : undefined}
         />
      );
   };

   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="template-items-grid"
      >
         {map(descriptors, (d, i) => item(d, i))}
      </div>
   );
};
