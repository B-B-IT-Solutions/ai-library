"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
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
import { updateWorkflowSchema } from "@/data/types/validators/workflow";
import { DWorkflowDetail } from "@/data/types/domain/workflow";

type FormValues = z.infer<typeof updateWorkflowSchema>;

type Props = {
   workflow?: DWorkflowDetail | null;
   onSaved: (workflow: DWorkflowDetail) => void;
};

export const WorkflowMetadataForm = ({ workflow, onSaved }: Props) => {
   const [loading, setLoading] = useState(false);

   const form = useForm<FormValues>({
      resolver: zodResolver(updateWorkflowSchema),
      defaultValues: {
         title: workflow?.title ?? "",
         description: workflow?.description ?? "",
      },
   });

   const onSubmit = async (values: FormValues) => {
      setLoading(true);
      try {
         let result;
         if (workflow) {
            result = await updateWorkflow(workflow.id, values);
         } else {
            result = await createWorkflow(values);
         }

         if (result.success && result.data) {
            toast.success(result.message);
            onSaved(result.data);
         } else {
            toast.error(result.message);
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="rounded-lg border bg-white p-4">
         <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Workflow-Details
         </h2>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                              rows={3}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !form.formState.isDirty}
                  className="w-full"
                  data-testid="save-workflow-meta-btn"
               >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Speichern
               </Button>
            </form>
         </Form>
      </div>
   );
};
