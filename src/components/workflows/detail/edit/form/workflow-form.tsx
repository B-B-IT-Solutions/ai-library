"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { createWorkflow, updateWorkflow } from "@/data/actions/workflow";
import { DWorkflow, DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { updateWorkflowSchema } from "@/data/types/validators/workflow";

type FormValues = z.infer<typeof updateWorkflowSchema>;

type Props = {
   workflow?: DWorkflowWithSteps | null;
   formId: string;
   onSaved: (workflow: DWorkflow) => void;
   onSubmittingChange: (submitting: boolean) => void;
};

export const WorkflowForm = ({
   workflow,
   formId,
   onSaved,
   onSubmittingChange,
}: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(updateWorkflowSchema),
      defaultValues: {
         title: workflow?.title ?? "",
         description: workflow?.description ?? "",
      },
   });

   const onSubmittingChangeRef = useRef(onSubmittingChange);
   onSubmittingChangeRef.current = onSubmittingChange;

   const onSubmit = async (values: FormValues) => {
      onSubmittingChangeRef.current(true);
      try {
         let result;
         if (workflow) {
            result = await updateWorkflow(workflow.id, values);
         } else {
            result = await createWorkflow(values);
         }

         if (result.success && result.data) {
            toast.success(result.message);
            form.reset(values); // clear dirty state after save
            onSaved(result.data);
         } else {
            toast.error(result.message);
         }
      } finally {
         onSubmittingChangeRef.current(false);
      }
   };

   return (
      <Form {...form}>
         <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
         >
            <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Titel *</FormLabel>
                     <FormControl>
                        <Input
                           {...field}
                           placeholder="Mein Workflow"
                           maxLength={250}
                           data-testid="workflow-title-input"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Beschreibung</FormLabel>
                     <FormControl>
                        <Textarea
                           {...field}
                           value={field.value ?? ""}
                           placeholder="Wofür wird dieser Workflow verwendet?"
                           maxLength={750}
                           rows={4}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </form>
      </Form>
   );
};
