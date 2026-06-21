"use client";

import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DWorkflowUpdate } from "@/data/types/domain/workflow";

import { BasicInfoTab } from "./basic-info-tab";
import { StepsTab } from "./steps-tab";

type Props = {
   control: Control<DWorkflowUpdate>;
};

export const WorkflowTabs = ({ control }: Props) => {
   const [activeTab, setActiveTab] = useState("basic-info");

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
               value="basic-info"
               className="rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none disabled:cursor-not-allowed disabled:opacity-40 data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
               data-testid="basic-info-tab-trigger"
            >
               Details
            </TabsTrigger>
            <TabsTrigger
               value="steps"
               className="rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none disabled:cursor-not-allowed disabled:opacity-40 data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
               data-testid="steps-tab-trigger"
            >
               Schritte
               {fieldSteps.length > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                     ({fieldSteps.length})
                  </span>
               )}
            </TabsTrigger>
         </TabsList>
         <BasicInfoTab control={control} value="basic-info" />
         <StepsTab control={control} value="steps" />
      </Tabs>
   );
};
