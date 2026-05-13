import { FC } from "react";
import { FileText } from "lucide-react";

import { MDRenderer } from "@/components/shared/md";
import { DPrompt0 } from "@/data/types/domain/prompt";
import { CopyPromptButton } from "../../../buttons";

type PromptContentProps = {
   prompt: DPrompt0;
};

export const PromptContent: FC<PromptContentProps> = ({ prompt }) => {
   return (
      <section className="space-y-3" data-testid="prompt-content">
         <h3
            className="flex items-center gap-2 text-lg font-semibold text-slate-900"
            data-testid="headline"
         >
            <FileText className="h-5 w-5 text-indigo-600" />
            Prompt
         </h3>

         <div className="group relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <CopyPromptButton prompt={prompt} size="icon-sm" />
            <MDRenderer data-testid="text">{prompt.content}</MDRenderer>
         </div>
      </section>
   );
};
