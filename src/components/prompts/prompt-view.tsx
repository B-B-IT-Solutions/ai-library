import { FC } from "react";

import { PromptsEmpty } from "@/components/prompts";

export const PromptView: FC = () => {
   return (
      <div
         className="h-full flex items-center justify-center"
         data-testid="prompt-view"
      >
         <PromptsEmpty />
      </div>
   );
};
