import { DPrompt } from "@/data/types/domain/prompt";
import {
   DeleteTemplateButton,
   DownloadPromptButton,
   EditButton,
   UseTemplateButton,
} from "../../../buttons";

type Props = {
   prompt: DPrompt;
};

export const PromptSidebar = ({ prompt }: Props) => {
   return (
      <aside
         className="space-y-3 lg:sticky lg:top-8 lg:self-start"
         data-testid="prompt-sidebar"
      >
         <UseTemplateButton
            descriptor={prompt}
            className="w-full justify-center py-5 text-sm"
         />
         <div className="space-y-1 pt-1">
            <EditButton prompt={prompt} />
            <DownloadPromptButton prompt={prompt} />
            <DeleteTemplateButton prompt={prompt} asButton />
         </div>
         <div className="border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs font-medium text-slate-400">
               Empfohlenes Modell
            </p>
            <div className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
               {prompt.recommendedModel}
            </div>
         </div>
      </aside>
   );
};
