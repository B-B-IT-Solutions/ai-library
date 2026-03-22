"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, History, Loader, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Form } from "@/components/shadcn/form";
import { Separator } from "@/components/shadcn/separator";
import { createPrompt, updatePrompt } from "@/data/actions/prompt";
import { DPromptDescriptor, DPromptUpdate } from "@/data/types/domain/prompt";
import { updatePromptSchema } from "@/data/types/validators/prompt";

import { PromptContentEdit } from "./content/prompt-content-edit";
import { PromptFollowUpsEdit } from "./follow-ups/prompt-follow-ups-edit";
import { BasicInfoEdit } from "./header/basic-info-edit";
import { removeEmpty } from "./utils";

type Props =
   | {
        prompt?: DPromptDescriptor;
        mode: "create";
     }
   | {
        prompt: DPromptDescriptor;
        mode: "edit";
     }
   | {
        prompt: DPromptUpdate;
        mode: "review-template";
     };

export const PromptEditForm = ({ prompt, mode }: Props) => {
   const router = useRouter();
   const isEdit = mode === "edit";
   const isReview = mode === "review-template";

   const initValues = () => {
      if (isEdit) {
         return {
            title: prompt.title,
            content: prompt.content,
            categories: prompt.categories.map((c) => c.name),
            recommendedModel: prompt.recommendedModel,
            followUpPrompts: prompt.followUpPrompts,
         };
      }
      if (isReview) {
         return {
            title: prompt.title,
            content: prompt.content,
            categories: prompt.categories,
            recommendedModel: prompt.recommendedModel,
            followUpPrompts: prompt.followUpPrompts,
         };
      }
      return {
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: [],
      };
   };

   const form = useForm<DPromptUpdate>({
      resolver: zodResolver(updatePromptSchema),
      defaultValues: initValues(),
   });

   const {
      fields: followUpPrompts,
      append: addFollowUpPrompt,
      remove: removeFollowUpPrompt,
   } = useFieldArray({
      control: form.control,
      name: "followUpPrompts",
      keyName: "_key",
   });

   const handleSave = async (data: DPromptUpdate, createVersion: boolean) => {
      const filteredCategories = removeEmpty(data.categories);
      const filteredFollowUpPrompts = data.followUpPrompts
         .filter((f) => f.content.trim() !== "")
         .map((f, idx) => ({ ...f, order: idx }));

      const payload: DPromptUpdate = {
         ...data,
         categories: filteredCategories,
         followUpPrompts: filteredFollowUpPrompts,
      };

      const result = isEdit
         ? await updatePrompt(prompt.id, payload, createVersion)
         : await createPrompt(payload);

      if (result.success) {
         toast.success(result.message);
         if (isEdit) {
            router.push(`/prompts/${prompt.id}`);
         } else {
            router.push("/prompts");
         }
      } else {
         toast.error(result.message);
      }
   };

   const onSubmit = (newVersion: boolean): SubmitHandler<DPromptUpdate> => {
      return async (data) => await handleSave(data, newVersion);
   };

   const cancelBtn = () => {
      return (
         <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
            data-testid="cancel-btn"
         >
            Abbrechen
         </Button>
      );
   };

   const saveBtnLabel = () => {
      if (form.formState.isSubmitting) {
         return (
            <>
               <Loader className="h-4 w-4 animate-spin" />
               Wird gespeichert...
            </>
         );
      }
      return (
         <>
            <Save className="h-4 w-4" />
            Speichern
         </>
      );
   };

   const createBtnLabel = () => {
      if (form.formState.isSubmitting) {
         return (
            <>
               <Loader className="h-4 w-4 animate-spin" />
               Wird erstellt...
            </>
         );
      }
      return (
         <>
            <Save className="h-4 w-4" />
            Prompt erstellen
         </>
      );
   };

   const saveBtns = () => {
      if (isEdit) {
         return (
            <div className="flex">
               <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="rounded-r-none"
                  data-testid="save-btn"
               >
                  {saveBtnLabel()}
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild={true}>
                     <Button
                        type="button"
                        disabled={form.formState.isSubmitting}
                        className="rounded-l-none border-l border-primary-foreground/20 px-2"
                        data-testid="dropdown-trigger-btn"
                     >
                        <ChevronDown className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem
                        onClick={form.handleSubmit(onSubmit(true))}
                        disabled={form.formState.isSubmitting}
                        data-testid="save-with-version-btn"
                     >
                        <History className="h-4 w-4" />
                        Als neue Version speichern
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         );
      }
      return (
         <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            data-testid="create-btn"
         >
            {createBtnLabel()}
         </Button>
      );
   };

   const actionBtns = () => {
      return (
         <div className="flex items-center justify-end gap-3 pt-2">
            {cancelBtn()}
            {saveBtns()}
         </div>
      );
   };

   return (
      <Card data-testid="prompt-edit-form">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               {isEdit ? "Prompt bearbeiten" : "Neuen Prompt erstellen"}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit(false))}
                  className="space-y-6"
                  data-testid="edit-form"
               >
                  <BasicInfoEdit control={form.control} />

                  <Separator />
                  <PromptContentEdit control={form.control} isEdit={isEdit} />
                  <Separator />
                  <PromptFollowUpsEdit
                     control={form.control}
                     followUpPrompts={followUpPrompts}
                     addFollowUpPrompt={addFollowUpPrompt}
                     removeFollowUpPrompt={removeFollowUpPrompt}
                  />
                  <Separator />
                  {actionBtns()}
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
