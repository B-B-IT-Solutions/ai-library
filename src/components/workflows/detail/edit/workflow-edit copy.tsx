"use client";

import { useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Separator } from "@/components/shadcn/separator";
import { Textarea } from "@/components/shadcn/textarea";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import {
   createWorkflow,
   createWorkflowStep,
   deleteWorkflowStep,
   updateWorkflow,
   updateWorkflowStep,
} from "@/data/actions/workflow";
import {
   DWorkflowStep,
   DWorkflowStepUpdate,
   DWorkflowWithSteps,
   WorkflowEditFormValues,
   WorkflowStepFormItem,
} from "@/data/types/domain/workflow";
import { workflowEditFormSchema } from "@/data/types/validators/workflow";
import { WorkflowBreadcrumb } from "../../breadcrumbs";
import { worfklowEditNavigateBackUrl } from "../../utils/utils";

import { WorkflowStepsEdit } from "./steps/workflow-steps-edit";

type Props = {
   initialWorkflow?: DWorkflowWithSteps;
};

const stepToFormItem = (step: DWorkflowStep): WorkflowStepFormItem => ({
   id: step.id,
   title: step.title,
   hint: step.hint ?? "",
   type: step.type,
   promptId: step.promptId ?? undefined,
   content: step.content ?? "",
   isStart: step.isStart,
   position: step.position,
   edges: step.outgoingEdges.map((e) => ({
      toStepId: e.toStepId,
      label: e.label,
      order: e.order,
   })),
});

export const WorkflowEdit = ({ initialWorkflow }: Props) => {
   const router = useRouter();
   const isEdit = !!initialWorkflow;
   const deletedStepIds = useRef<string[]>([]);

   const form = useForm<WorkflowEditFormValues>({
      resolver: zodResolver(workflowEditFormSchema),
      defaultValues: {
         title: initialWorkflow?.title ?? "",
         description: initialWorkflow?.description ?? "",
         steps: initialWorkflow?.steps.map(stepToFormItem) ?? [],
      },
   });

   const {
      fields: stepFields,
      append: appendStep,
      remove: removeStepAt,
   } = useFieldArray({
      control: form.control,
      name: "steps",
      keyName: "_key",
   });

   const handleRemoveStep = (index: number) => {
      const stepId = form.getValues(`steps.${index}.id`);
      if (stepId) {
         deletedStepIds.current.push(stepId);
      }
      removeStepAt(index);
   };

   const onSubmit = async (data: WorkflowEditFormValues) => {
      let workflowId = initialWorkflow?.id;
      const wPayload = { title: data.title, description: data.description };

      const wResult = workflowId
         ? await updateWorkflow(workflowId, wPayload)
         : await createWorkflow(wPayload);

      if (!wResult.success || !wResult.data) {
         toast.error(wResult.message);
         return;
      }
      workflowId = wResult.data.id;

      for (const stepId of deletedStepIds.current) {
         const result = await deleteWorkflowStep(stepId, workflowId);
         if (!result.success) {
            toast.error(result.message);
            return;
         }
      }
      deletedStepIds.current = [];

      for (let i = 0; i < data.steps.length; i++) {
         const step = data.steps[i];
         const payload: DWorkflowStepUpdate = {
            title: step.title,
            hint: step.hint || null,
            type: step.type,
            promptId: step.type === "PROMPT_REF" ? step.promptId || null : null,
            content: step.type === "STANDALONE" ? step.content : null,
            isStart: step.isStart ?? false,
            position: i,
            edges: step.edges,
         };

         const result = step.id
            ? await updateWorkflowStep(step.id, workflowId, payload)
            : await createWorkflowStep(workflowId, payload);

         if (!result.success) {
            toast.error(result.message);
            return;
         }
      }

      toast.success(isEdit ? "Workflow aktualisiert" : "Workflow erstellt");
      router.push(`/workflows/${workflowId}`);
   };

   const backUrl = useMemo(
      () => worfklowEditNavigateBackUrl(initialWorkflow),
      [initialWorkflow]
   );

   const { isSubmitting } = form.formState;
   const formId = "workflow-edit-form";

   return (
      <ItemDetailsEdit data-testid="workflow-edit">
         <ItemDetailsEditHeader>
            {initialWorkflow ? (
               <WorkflowBreadcrumb variant="edit" workflow={initialWorkflow} />
            ) : (
               <WorkflowBreadcrumb variant="new" />
            )}
            <div
               className="ml-auto hidden lg:flex"
               data-testid="header-actions"
            >
               <div className="flex items-center gap-2">
                  <Button
                     asChild
                     type="button"
                     variant="outline"
                     disabled={isSubmitting}
                     className="cursor-pointer"
                     data-testid="cancel-btn"
                  >
                     <Link href={backUrl}>Abbrechen</Link>
                  </Button>
                  <Button
                     type="submit"
                     form={formId}
                     disabled={isSubmitting}
                     className="cursor-pointer bg-blue-700 hover:bg-blue-800"
                     data-testid="save-btn"
                  >
                     {isSubmitting ? (
                        <>
                           <Loader className="h-4 w-4 animate-spin" />
                           {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
                        </>
                     ) : isEdit ? (
                        "Workflow speichern"
                     ) : (
                        "Workflow erstellen"
                     )}
                  </Button>
               </div>
            </div>
         </ItemDetailsEditHeader>

         <ItemDetailsEditContent>
            <ItemDetailsEditBody className="max-w-3xl">
               <Form {...form}>
                  <form
                     id={formId}
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Titel{" "}
                                 <span className="text-destructive">*</span>
                              </FormLabel>
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

                     <Separator />

                     <WorkflowStepsEdit
                        control={form.control}
                        fields={stepFields}
                        addStep={appendStep}
                        removeStep={handleRemoveStep}
                     />
                  </form>
               </Form>
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
