import { isEmpty, map } from "es-toolkit/compat";

import { DPrompt0 } from "@/data/types/domain/prompt0";

import { PromptItem } from "./items/prompt-item";

type Props = {
   prompts: DPrompt0[];
};

export const PromptsGrid = ({ prompts }: Props) => {
   if (isEmpty(prompts)) {
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="prompts-empty"
         >
            <p className="text-lg font-medium text-slate-600">
               Keine Prompts gefunden
            </p>
            <p className="mt-2 text-sm text-slate-500">
               Versuchen Sie, Ihre Filterkriterien anzupassen
            </p>
         </div>
      );
   }

   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="prompts-grid"
      >
         {map(prompts, (prompt) => (
            <PromptItem key={prompt.id} prompt={prompt} />
         ))}
      </div>
   );
};
