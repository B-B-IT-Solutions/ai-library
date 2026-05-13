import { FC } from "react";

import { CopyButton } from "@/components/shared/buttons";
import { DPrompt0FollowUp } from "@/data/types/domain/prompt";

type CopyPromptFollowUpButtonProps = {
   followUp: DPrompt0FollowUp;
};

export const CopyPromptFollowUpButton: FC<CopyPromptFollowUpButtonProps> = ({
   followUp,
}) => {
   const className =
      "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white";
   return (
      <CopyButton
         content={followUp.content}
         size="icon-sm"
         showLabel={false}
         className={className}
         data-testid="copy-prompt-follow-up-btn"
      />
   );
};
