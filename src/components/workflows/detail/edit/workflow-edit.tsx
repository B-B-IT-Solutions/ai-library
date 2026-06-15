"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/shadcn/tabs";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { createWorkflow, updateWorkflow } from "@/data/actions/workflow";
import {
   DWorkflowsUsage,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { updateWorkflowSchema } from "@/data/types/validators/workflow";
import { WorkflowBreadcrumb } from "../../breadcrumbs";
import {
   viewWorkflowUrl,
   worfklowEditNavigateBackUrl,
} from "../../utils/utils";

import { WorkflowForm } from "./form";
import { WorkflowSteps } from "./steps/steps";
import { initWorkflow } from "./utils";

const TAB_TRIGGER_CLASS =
   "rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none disabled:cursor-not-allowed disabled:opacity-40";

type Props = {
   workflow?: DWorkflowWithSteps;
   usage?: DWorkflowsUsage;
};

export const WorkflowEdit = ({ workflow }: Props) => {
   const [activeTab, setActiveTab] = useState("details");
   const [isSubmitting, startTransition] = useTransition();

   const steps = workflow?.steps ?? [];
   const router = useRouter();
   const isEdit = !!workflow;

   const form = useForm<DWorkflowUpdate>({
      resolver: zodResolver(updateWorkflowSchema),
      defaultValues: initWorkflow(workflow),
   });

   const handleSave = async (data: DWorkflowUpdate) => {
      if (isEdit) {
         const result = await updateWorkflow(workflow.id, data);
         if (result.success) {
            toast.success(result.message);
            const viewUrl = viewWorkflowUrl(workflow);
            router.push(viewUrl);
         } else {
            toast.error(result.message);
         }
      } else {
         const result = await createWorkflow(data);
         if (result.success) {
            toast.success(result.message);
            const viewUrl = viewWorkflowUrl(result.data!);
            router.push(viewUrl);
         } else if (result.upgradeRequired) {
            toast.error(result.message, {
               action: {
                  label: "Upgrade",
                  onClick: () => router.push("/subscription/pricing"),
               },
            });
         } else {
            toast.error(result.message);
         }
      }
   };

   const onSubmit = async (data: DWorkflowUpdate) => {
      // const payload: DWorkflowUpdate = {
      //    ...data,
      //    promptId: data.type === "PROMPT_REF" ? data.promptId || null : null,
      //    content: data.type === "STANDALONE" ? data.content : null,
      //    hint: values.hint || null,
      // };

      startTransition(async () => {
         handleSave(data);
      });
   };

   const backUrl = useMemo(
      () => worfklowEditNavigateBackUrl(workflow),
      [workflow]
   );

   const formId = "workflow-edit-form";

   const breadcrumb = () => {
      if (workflow) {
         return <WorkflowBreadcrumb variant="edit" workflow={workflow} />;
      }
      return <WorkflowBreadcrumb variant="new" />;
   };

   const cancelBtn = () => {
      return (
         <Button
            asChild={true}
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid="cancel-btn"
         >
            <Link href={backUrl}>Abbrechen</Link>
         </Button>
      );
   };

   const submitBtn = () => {
      return (
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
            ) : (
               <>{isEdit ? "Workflow speichern" : "Workflow erstellen"}</>
            )}
         </Button>
      );
   };

   const actions = () => {
      return (
         <div className="flex items-center gap-2">
            {cancelBtn()}
            {submitBtn()}
         </div>
      );
   };

   const body = () => {
      return (
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col overflow-hidden"
         >
            <TabsList className="h-auto w-full gap-0 rounded-none border-b border-slate-200 bg-transparent p-0">
               <TabsTrigger
                  value="details"
                  className={TAB_TRIGGER_CLASS}
                  data-testid="tab-details-btn"
               >
                  Details
                  {form.formState.isDirty && (
                     <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
               </TabsTrigger>
               <TabsTrigger
                  value="steps"
                  disabled={!isEdit}
                  className={TAB_TRIGGER_CLASS}
                  data-testid="tab-steps-btn"
               >
                  Schritte
                  {steps.length > 0 && (
                     <span className="ml-1.5 text-xs text-muted-foreground">
                        ({steps.length})
                     </span>
                  )}
                  {form.formState.isDirty && (
                     <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
               </TabsTrigger>
            </TabsList>
            <FormProvider {...form}>
               <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="details" className="overflow-y-auto">
                     <div className="mx-auto max-w-2xl px-6 py-8">
                        <WorkflowForm control={form.control} />
                     </div>
                  </TabsContent>
                  <TabsContent value="steps" className="overflow-hidden">
                     <WorkflowSteps control={form.control} />
                  </TabsContent>
               </form>
            </FormProvider>
         </Tabs>
      );
   };

   return (
      <ItemDetailsEdit data-testid="workflow-edit">
         <ItemDetailsEditHeader>
            {breadcrumb()}
            <div
               className="ml-auto hidden lg:flex"
               data-testid="header-actions"
            >
               {actions()}
            </div>
         </ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBody className="max-w-7xl">
               {body()}
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
