import { isEmpty, map } from "es-toolkit/compat";

import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptListItem } from "./items/prompt-list-item";

type Props = {
   prompts: DPromptDescriptor[];
};

export const PromptsGrid = ({ prompts }: Props) => {
   if (isEmpty(prompts)) {
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="library-entries-empty"
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
         data-testid="library-entries-grid"
      >
         {map(prompts, (prompt) => (
            <PromptListItem key={prompt.id} prompt={prompt} />
         ))}
      </div>
   );
};
