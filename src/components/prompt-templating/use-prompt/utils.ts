import { filter } from "es-toolkit/compat";

import {
   DPromptVariable,
   DPromptVariableValues,
} from "@/data/types/domain/prompt";

export const requiredVariables = (variables: DPromptVariable[]) => {
   return filter(variables, (f) => f.required);
};

export const requiredVariablesWithValue = (
   variables: DPromptVariable[],
   currentValues: DPromptVariableValues
) => {
   const variablesWithValue = filter(variables, (f) => {
      const val = currentValues[f.name];
      if (f.type === "CHECKBOX") {
         return val === true;
      }
      return val !== undefined && val !== null && val !== "";
   });
   return variablesWithValue;
};
