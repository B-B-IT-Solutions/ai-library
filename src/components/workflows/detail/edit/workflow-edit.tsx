"use client";

import { useMemo, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
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
import { viewWorkflowUrl, worfklowEditNavigateBackUrl } from "../../utils";

import { WorkflowTabs } from "./form/tabs";
import { initWorkflow } from "./form/utils";

type Props = {
   workflow?: DWorkflowWithSteps;
   usage?: DWorkflowsUsage;
};

export const WorkflowEdit = ({ workflow }: Props) => {
   const router = useRouter();
   const [isSubmitting, startTransition] = useTransition();

   const isEdit = !!workflow;

   const form = useForm<DWorkflowUpdate>({
      resolver: zodResolver(updateWorkflowSchema),
      defaultValues: initWorkflow(workflow),
   });

   const handleSave = async (data: DWorkflowUpdate) => {
      if (isEdit) {
         console.log(data);
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
               <FormProvider {...form}>
                  <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
                     <WorkflowTabs control={form.control} />
                  </form>
               </FormProvider>
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
