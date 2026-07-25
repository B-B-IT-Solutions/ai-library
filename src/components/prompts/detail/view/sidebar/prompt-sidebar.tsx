import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPromptVersionsResult, DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import {
   DeletePromptButton,
   DownloadPromptButton,
   EditPromptButton,
   UsePromptButton,
} from "../../../buttons";
import { VersionHistoryButton } from "../../versioning";

type Props = {
   prompt: DPromptWithContent;
   currentCollection?: DCollectionPreview;
   versionsResult: DPromptVersionsResult;
   globalFields: DGlobalPromptField[];
};

export const PromptSidebar = ({
   prompt,
   currentCollection,
   versionsResult,
   globalFields,
}: Props) => {
   return (
      <aside
         className="space-y-3 lg:sticky lg:top-8 lg:self-start"
         data-testid="prompt-sidebar"
      >
         <UsePromptButton
            descriptor={prompt}
            className="w-full justify-start py-5 text-sm"
         />
         <div className="space-y-1 pt-1">
            <EditPromptButton
               prompt={prompt}
               currentCollection={currentCollection}
            />
            <VersionHistoryButton
               prompt={prompt}
               versionsResult={versionsResult}
               globalFields={globalFields}
            />
            <DownloadPromptButton prompt={prompt} />
            <DeletePromptButton prompt={prompt} />
         </div>
         <div className="border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs font-medium text-slate-400">
               Empfohlenes Modell
            </p>
            <div className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
               {prompt.model}
            </div>
         </div>
      </aside>
   );
};
