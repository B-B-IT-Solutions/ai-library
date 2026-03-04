import { FC } from "react";

import { DPromptFollowUp } from "@/data/types/domain/prompt";
import { CopyPromptFollowUpButton } from "../../../buttons";

type PromptFollowUpProps = {
   followUp: DPromptFollowUp;
};

export const PromptFollowUp: FC<PromptFollowUpProps> = ({ followUp }) => {
   return (
      <div
         key={followUp.id}
         className="group relative flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
         data-testid="prompt-follow-up"
      >
         <pre
            className="pr-10 font-mono text-sm whitespace-pre-wrap text-slate-700"
            data-testid="text"
         >
            {followUp.content}
         </pre>
         <CopyPromptFollowUpButton followUp={followUp} />
      </div>
   );
};
