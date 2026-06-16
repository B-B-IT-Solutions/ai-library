import { map } from "es-toolkit/compat";

import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import { PromptItem } from "../item";

type Props = {
   prompts: DPrompt[];
   currentColleciton?: DCollectionPreview;
   ref?: React.Ref<HTMLDivElement>;
};

export const PromptsList = ({ prompts, currentColleciton, ref }: Props) => {
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
      <div className="space-y-4" data-testid="prompts-list">
         {map(prompts, (d, i) => item(d, i))}
      </div>
   );
};
