import { isEmpty, map } from "es-toolkit/compat";

import { DPrompt } from "@/data/types/domain/prompt";
import { PublicPromptItem } from "../item";

type Props = {
   prompts: DPrompt[];
   collectionToken?: string | null;
   ref?: React.Ref<HTMLDivElement>;
};

export const PublicPromptItemsGrid = ({
   prompts,
   collectionToken,
   ref,
}: Props) => {
   if (isEmpty(prompts)) {
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="prompt-items-empty"
         >
            <p className="text-lg font-medium text-slate-600">
               Keine Vorlagen gefunden
            </p>
            <p className="mt-2 text-sm text-slate-500">
               Versuchen Sie, Ihre Filterkriterien anzupassen
            </p>
         </div>
      );
   }

   const item = (prompt: DPrompt, index: number) => {
      const isLast = index === prompts.length - 1;
      return (
         <PublicPromptItem
            key={prompt.id}
            prompt={prompt}
            collectionToken={collectionToken}
            ref={isLast ? ref : undefined}
         />
      );
   };

   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="public-prompt-items-grid"
      >
         {map(prompts, (p, idx) => item(p, idx))}
      </div>
   );
};
