import { paramQueryKey } from "../utils";

import { LoadPromptTemplatesParams } from "./types";

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
