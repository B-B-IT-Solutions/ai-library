import { filterQueryKey } from "../utils";

import type {
   LoadPromptPreviewsPageParams,
   LoadPromptsPageParams,
   LoadPromptTemplatingDataParams,
} from "./types";

export const promptKeys = {
   all: ["prompts"] as const,
   prompts: ({ filters, sort }: LoadPromptsPageParams) =>
      [...promptKeys.all, filterQueryKey(filters, sort)] as const,
   publicPrompts: ({ filters, sort }: LoadPromptsPageParams) =>
      [...promptKeys.all, "public", filterQueryKey(filters, sort)] as const,
   promptPreviews: ({ filters, sort }: LoadPromptPreviewsPageParams) =>
      [...promptKeys.all, "previews", filterQueryKey(filters, sort)] as const,
   templatingData: ({ promptId }: LoadPromptTemplatingDataParams) =>
      [...promptKeys.all, "templatingData", promptId] as const,
};

export const templateCategoriesKeys = {
   all: ["prompt-template-categories"],
   categories: (search?: string) => {
      return [...templateCategoriesKeys.all, { search }] as const;
   },
};
