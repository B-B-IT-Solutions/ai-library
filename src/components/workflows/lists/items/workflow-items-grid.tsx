import { map } from "es-toolkit/compat";

import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { PromptItem } from "./items";

type Props = {
   descriptors: DPrompt[];
   currentColleciton?: DCollectionPreview;
   ref?: React.Ref<HTMLDivElement>;
};

export const PromptItemsGrid = ({
   descriptors,
   currentColleciton,
   ref,
}: Props) => {
   const item = (descriptor: DPrompt, index: number) => {
      const isLast = index === descriptors.length - 1;
      return (
         <PromptItem
            key={descriptor.id}
            prompt={descriptor}
            currentCollection={currentColleciton}
            ref={isLast ? ref : undefined}
         />
      );
   };

   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="prompt-items-grid"
      >
         {map(descriptors, (d, i) => item(d, i))}
      </div>
   );
};
