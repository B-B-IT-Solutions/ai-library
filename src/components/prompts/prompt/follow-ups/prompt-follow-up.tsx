import { FC } from "react";

import { DPromptFollowUp } from "@/data/types/domain/prompt";
import { CopyPromptFollowUpButton } from "../../buttons";

type PromptFollowUpProps = {
   followUp: DPromptFollowUp;
};

export const PromptFollowUp: FC<PromptFollowUpProps> = ({ followUp }) => {
   return (
      <div
         key={followUp.id}
         className="group relative flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
         data-testid="prompt-follow-up"
      >
         <pre
            className="whitespace-pre-wrap text-sm font-mono text-slate-700 pr-10"
            data-testid="text"
         >
            {followUp.content}
         </pre>
         <CopyPromptFollowUpButton followUp={followUp} />
      </div>
   );
};
