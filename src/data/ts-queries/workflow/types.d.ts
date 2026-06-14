import { Sort } from "@/data/types/common";
import { DWorkflowsFilter } from "@/data/types/domain/workflow";

export type LoadWorkflowsPageParams = {
   filters?: DWorkflowsFilter;
   sort?: Sort;
};
