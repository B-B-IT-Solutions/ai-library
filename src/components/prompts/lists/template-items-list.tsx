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

export const TemplateItemsList = ({
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
      <div className="space-y-4" data-testid="template-items-list">
         {map(descriptors, (d, i) => item(d, i))}
      </div>
   );
};
