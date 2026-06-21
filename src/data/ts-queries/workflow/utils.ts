import { filterQueryKey } from "../utils";

import type { LoadWorkflowsPageParams } from "./types";

export const workflowKeys = {
   all: ["workflows"] as const,
   workflows: ({ filters, sort }: LoadWorkflowsPageParams) =>
      [...workflowKeys.all, filterQueryKey(filters, sort)] as const,
};
