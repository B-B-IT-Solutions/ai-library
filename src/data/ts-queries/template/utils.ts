import { filterQueryKey } from "../utils";

import { LoadTemplateDescriptorsParams } from "./types";

export const templateKeys = {
   all: ["templates"] as const,
   templates: ({ filters, sort }: LoadTemplateDescriptorsParams) =>
      [...templateKeys.all, filterQueryKey(filters, sort)] as const,
   publicTemplates: ({ filters, sort }: LoadTemplateDescriptorsParams) =>
      [...templateKeys.all, "public", filterQueryKey(filters, sort)] as const,
};

export const templateCategoriesKeys = {
   all: ["prompt-template-categories"],
   categories: () => {
      return [...templateCategoriesKeys.all] as const;
   },
};
