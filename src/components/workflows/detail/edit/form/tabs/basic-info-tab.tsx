"use client";

import { Control } from "react-hook-form";

import { TabsContent } from "@/components/shadcn/tabs";
import { DWorkflowUpdate } from "@/data/types/domain/workflow";
import { WorkflowForm } from "..";

type Props = {
   control: Control<DWorkflowUpdate>;
   value: string;
};

export const BasicInfoTab = ({ control, value }: Props) => {
   return (
      <TabsContent
         value={value}
         className="overflow-y-auto"
         data-testid="basic-info-tab"
      >
         <div className="mx-auto max-w-2xl px-6 py-8">
            <WorkflowForm control={control} />
         </div>
      </TabsContent>
   );
};
