import { queryKey } from "../utils";

import { LoadPromptParams, LoadPromptTemplatesParams } from "./types";

export const promptKeys = {
   all: ["prompts"],
   prompts: (params?: LoadPromptParams) => {
      return [...promptKeys.all, queryKey(params)] as const;
   },
};

export const promptTemplateKeys = {
   all: ["prompt-templates"],
   templates: (params?: LoadPromptTemplatesParams) => {
      return [...promptTemplateKeys.all, queryKey(params)] as const;
   },
};

export const promptTemplateCategoryKeys = {
   all: ["prompt-template-categories"],
   categories: () => {
      return [...promptTemplateCategoryKeys.all] as const;
   },
};
