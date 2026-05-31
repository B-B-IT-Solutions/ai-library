import { includes } from "es-toolkit/compat";

import { DPromptVariableUpdate } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { getVariableStatus } from "../utils";

export const resolveVariableStatus = (
   detectedVariables: string[],
   promptVariables: DPromptVariableUpdate[],
   globalVariables: DGlobalPromptField[],
   globalVariableIds: string[]
) => {
   const promptVariableNames = promptVariables.map((f) => f.name);
   const globalVariabledNames = globalVariables
      .filter((gf) => includes(globalVariableIds, gf.id))
      .map((gf) => gf.name);

   const allVariableNames = [...promptVariableNames, ...globalVariabledNames];
   return getVariableStatus(detectedVariables, allVariableNames);
};
