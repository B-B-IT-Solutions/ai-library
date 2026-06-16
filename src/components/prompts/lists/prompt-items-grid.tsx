import { map } from "es-toolkit/compat";

import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { PromptItem } from "./items";

type Props = {
   prompts: DPrompt[];
   currentColleciton?: DCollectionPreview;
   ref?: React.Ref<HTMLDivElement>;
};

export const PromptItemsGrid = ({ prompts, currentColleciton, ref }: Props) => {
   const item = (prompt: DPrompt, index: number) => {
      const isLast = index === prompts.length - 1;
      return (
         <PromptItem
            key={prompt.id}
            prompt={prompt}
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
         {map(prompts, (p, i) => item(p, i))}
      </div>
   );
};
