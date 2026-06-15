"use client";

import { Control } from "react-hook-form";

import { TabsContent } from "@/components/shadcn/tabs";
import { DWorkflowUpdate } from "@/data/types/domain/workflow";
import { WorkflowSteps } from "../../steps/workflow-steps";

type Props = {
   control: Control<DWorkflowUpdate>;
   value: string;
};

export const StepsTab = ({ control, value }: Props) => {
   return (
      <TabsContent
         value={value}
         className="overflow-hidden"
         data-testid="steps-tab"
      >
         <WorkflowSteps control={control} />
      </TabsContent>
   );
};
