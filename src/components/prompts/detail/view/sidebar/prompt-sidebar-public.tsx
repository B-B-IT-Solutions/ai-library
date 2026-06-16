import { DPrompt } from "@/data/types/domain/prompt";
import { DownloadPromptButton, PublicUsePromptButton } from "../../../buttons";

type Props = {
   prompt: DPrompt;
};

export const PromptSidebarPublic = ({ prompt }: Props) => {
   return (
      <aside
         className="space-y-3 lg:sticky lg:top-8 lg:self-start"
         data-testid="prompt-sidebar-public"
      >
         <PublicUsePromptButton
            prompt={prompt}
            className="w-full justify-start py-5 text-sm"
         />
         <div className="space-y-1 pt-1">
            <DownloadPromptButton prompt={prompt} />
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
