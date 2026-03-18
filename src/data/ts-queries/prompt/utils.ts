import { paramQueryKey } from "../utils";

import { LoadPromptsParams } from "./types";

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
