"use client";

import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/shadcn/tabs";
import { DWorkflowUpdate } from "@/data/types/domain/workflow";
import { WorkflowForm } from "../../form";
import { WorkflowSteps } from "../../steps/steps";

type Props = {
   control: Control<DWorkflowUpdate>;
};

export const WorkflowEdit = ({ control }: Props) => {
   const [activeTab, setActiveTab] = useState("workflow");

   const { fields: fieldSteps } = useFieldArray({
      name: "steps",
      control,
   });

   return (
      <Tabs
         value={activeTab}
         onValueChange={setActiveTab}
         className="flex flex-1 flex-col overflow-hidden"
         data-testid="workflow-tabs"
      >
         <TabsList className="h-auto w-full gap-0 rounded-none border-b border-slate-200 bg-transparent p-0">
            <TabsTrigger
               value="workflow"
               className="rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none disabled:cursor-not-allowed disabled:opacity-40 data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
               data-testid="tab-workflow-btn"
            >
               Details
            </TabsTrigger>
            <TabsTrigger
               value="steps"
               className="rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none disabled:cursor-not-allowed disabled:opacity-40 data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
               data-testid="tab-steps-btn"
            >
               Schritte
               {fieldSteps.length > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                     ({fieldSteps.length})
                  </span>
               )}
            </TabsTrigger>
         </TabsList>
         <TabsContent value="workflow" className="overflow-y-auto">
            <div className="mx-auto max-w-2xl px-6 py-8">
               <WorkflowForm control={control} />
            </div>
         </TabsContent>
         <TabsContent value="steps" className="overflow-hidden">
            <WorkflowSteps control={control} />
         </TabsContent>
      </Tabs>
   );
};
