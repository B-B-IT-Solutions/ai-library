import { queryKey } from "../utils";

import { LoadPromptTemplatesParams } from "./types";

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
