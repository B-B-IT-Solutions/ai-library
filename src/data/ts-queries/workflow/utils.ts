import { filterQueryKey } from "../utils";

import type { LoadWorkflowsPageParams } from "./types";

export const workflowKeys = {
   all: ["workflows"] as const,
   workflowsPage: ({ filters, sort }: LoadWorkflowsPageParams) =>
      [...workflowKeys.all, filterQueryKey(filters, sort)] as const,
   usage: () => [...workflowKeys.all, "usage"] as const,
};
