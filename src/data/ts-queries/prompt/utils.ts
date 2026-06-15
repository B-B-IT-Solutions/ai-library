import { filterQueryKey } from "../utils";

import type {
   LoadPromptPreviewsPageParams,
   LoadPromptsPageParams,
} from "./types";

export const templateKeys = {
   all: ["templates"] as const,
   prompts: ({ filters, sort }: LoadPromptsPageParams) =>
      [...templateKeys.all, filterQueryKey(filters, sort)] as const,
   publicPrompts: ({ filters, sort }: LoadPromptsPageParams) =>
      [...templateKeys.all, "public", filterQueryKey(filters, sort)] as const,
   promptPreviews: ({ filters, sort }: LoadPromptPreviewsPageParams) =>
      [...templateKeys.all, "previews", filterQueryKey(filters, sort)] as const,
};

export const templateCategoriesKeys = {
   all: ["prompt-template-categories"],
   categories: () => {
      return [...templateCategoriesKeys.all] as const;
   },
};
