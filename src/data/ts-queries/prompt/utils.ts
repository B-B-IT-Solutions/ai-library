import { paramQueryKey } from "../utils";

import { LoadPromptsParams, LoadPromptTemplatesParams } from "./types";

export const promptKeys = {
   all: ["prompts"],
   prompts: (params?: LoadPromptsParams) => {
      return [...promptKeys.all, paramQueryKey(params)] as const;
   },
};

export const promptCategoriesKeys = {
   all: ["prompt-categories"],
   categories: () => {
      return [...promptCategoriesKeys.all] as const;
   },
};

export const promptTemplateKeys = {
   all: ["prompt-templates"],
   templates: (params?: LoadPromptTemplatesParams) => {
      return [...promptTemplateKeys.all, paramQueryKey(params)] as const;
   },
};

export const promptTemplateCategoriesKeys = {
   all: ["prompt-template-categories"],
   categories: () => {
      return [...promptTemplateCategoriesKeys.all] as const;
   },
};
