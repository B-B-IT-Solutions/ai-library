import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptViewForm } from "./prompt-view-form";

type Props = {
   prompt: DPromptDescriptor;
};

export const PromptView = ({ prompt }: Props) => {
   return (
      <div className="container mx-auto px-4 py-8" data-testid="prompt-view">
         <div className="mx-auto max-w-5xl p-4">
            <PromptViewForm prompt={prompt} />
         </div>
      </div>
   );
};
