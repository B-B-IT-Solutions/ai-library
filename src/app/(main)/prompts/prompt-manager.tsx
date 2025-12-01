"use client";

import { FC } from "react";

import { PromptsEmpty } from "@/components/prompts/prompt";
import { DPrompt } from "@/data/types/domain/prompt";

type PromptManagerProps = {
   prompt?: DPrompt;
};

export const PromptManager: FC<PromptManagerProps> = ({ prompt }) => {
   return (
      <div
         className="h-full rounded-lg bg-slate-50 text-slate-900 flex"
         data-testid="prompt-manager"
      >
         <div className="flex-1 p-6">
            <PromptsEmpty />
         </div>
      </div>
   );
};
