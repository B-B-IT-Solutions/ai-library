import { FC } from "react";
import { map, reverse } from "es-toolkit/compat";
import { History } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptVersion } from "./prompt-version";

type PromptVersionsProps = {
   prompt: DPromptDescriptor;
};

export const PromptVersions: FC<PromptVersionsProps> = ({ prompt }) => {
   if (!prompt.versions || prompt.versions.length === 0) {
      return null;
   }

   const versions = reverse(prompt.versions);

   return (
      <div className="space-y-4" data-testid="prompt-versions">
         <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
               <History className="size-4" />
               Version History
            </h3>
            <Badge variant="secondary">{prompt.versions.length}</Badge>
         </div>
         <div className="space-y-2">
            {map(versions, (version, idx) => (
               <PromptVersion
                  version={version}
                  isCurrent={idx === 0}
                  key={version.version}
               />
            ))}
         </div>
      </div>
   );
};
