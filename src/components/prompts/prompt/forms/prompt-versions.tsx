import { FC } from "react";
import { map, reverse } from "es-toolkit/compat";

import { DPrompt } from "@/data/types/domain/prompt";

import { PromptVersion } from "./prompt-version";

type PromptVersionsProps = {
   prompt: DPrompt;
};

export const PromptVersions: FC<PromptVersionsProps> = ({ prompt }) => {
   const versions = reverse(prompt.versions);
   return (
      <div className="space-y-4" data-testid="prompt-versions">
         <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
            Version History ({prompt.versions.length})
         </h3>
         {map(versions, (version, idx) => (
            <PromptVersion version={version} isCurrent={idx === 0} key={idx} />
         ))}
      </div>
   );
};
