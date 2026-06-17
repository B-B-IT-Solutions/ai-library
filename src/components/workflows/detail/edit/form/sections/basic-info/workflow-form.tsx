"use client";

import { Control } from "react-hook-form";

import { FormInput, FormTextArea } from "@/components/shared/widgets";
import { DWorkflowUpdate } from "@/data/types/domain/workflow";

type Props = {
   control: Control<DWorkflowUpdate>;
};

export const WorkflowEditForm = ({ control }: Props) => {
   return (
      <div className="space-y-4" data-testid="workflow-edit-form">
         <FormInput<DWorkflowUpdate>
            name="title"
            label="Titel"
            placeholder="Mein Workflow"
            required={true}
            control={control}
         />

         <FormTextArea<DWorkflowUpdate>
            name="description"
            label="Hinwweis"
            placeholder="Wofür wird dieser Workflow verwendet?"
            maxLength={750}
            rows={4}
            control={control}
         />
      </div>
   );
};
