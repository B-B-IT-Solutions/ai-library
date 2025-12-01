import { FC } from "react";

import { PromptsEmpty } from "@/components/prompts/prompt";

export const PromptView: FC = () => {
   return (
      <div
         className="h-full rounded-lg bg-slate-50 text-slate-900 flex"
         data-testid="prompt-view"
      >
         <div className="flex-1 p-6">
            <PromptsEmpty />
         </div>
      </div>
   );
};
