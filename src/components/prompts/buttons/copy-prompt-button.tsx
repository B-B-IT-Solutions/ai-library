import { FC } from "react";

import { CopyButton } from "@/components/shared/buttons";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

type CopyPromptButtonProps = {
   prompt: DPromptDescriptor;
   size: "sm" | "icon-sm";
   showLabel?: boolean;
};

export const CopyPromptButton: FC<CopyPromptButtonProps> = ({
   prompt,
   size,
   showLabel,
}) => {
   const className =
      size === "icon-sm"
         ? "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
         : undefined;

   return (
      <CopyButton
         content={prompt.content}
         size={size}
         showLabel={showLabel}
         className={className}
         data-testid="copy-prompt-btn"
      />
   );
};
