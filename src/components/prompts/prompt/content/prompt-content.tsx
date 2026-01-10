import { FC } from "react";
import { FileText } from "lucide-react";

import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { CopyPromptButton } from "../../buttons/copy-prompt-button";

type PromptContentProps = {
   prompt: DPromptDescriptor;
};

export const PromptContent: FC<PromptContentProps> = ({ prompt }) => {
   return (
      <section className="space-y-3" data-testid="prompt-content">
         <h3
            className="text-lg font-semibold text-slate-900 flex items-center gap-2"
            data-testid="headline"
         >
            <FileText className="h-5 w-5 text-indigo-600" />
            Prompt
         </h3>

         <div className="group relative bg-slate-50 border border-slate-200 rounded-lg p-4">
            <CopyPromptButton
               prompt={prompt}
               size="icon-sm"
               className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
            />
            <pre
               className="whitespace-pre-wrap text-sm font-mono text-slate-700 pr-10"
               data-testid="text"
            >
               {prompt.content}
            </pre>
         </div>
      </section>
   );
};
