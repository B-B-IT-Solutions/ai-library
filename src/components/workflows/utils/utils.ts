import { DWorkflow } from "@/data/types/domain/workflow";

export const isEditMode = (workflow?: DWorkflow) => {
   return !!workflow;
};

export const newWorkflowUrl = () => {
   return "/workflows/new";
};

export const worfklowEditNavigateBackUrl = (workflow?: DWorkflow) => {
   const isEdit = isEditMode(workflow);

   if (isEdit) {
      return `/workflows/${workflow!.id}`;
   }

   return "/workflows";
};

export const breadcrumbRootUrl = () => {
   return "/workflows";
};
