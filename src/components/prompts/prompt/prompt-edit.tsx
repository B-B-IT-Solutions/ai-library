"use client";

import { FC } from "react";
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
import {
   createPrompt,
   updatePrompt,
} from "@/data/actions/prompt/prompt.actions";
import {
   DPromptCreate,
   DPromptDescriptor,
   DPromptUpdate,
} from "@/data/types/domain/prompt";
import { updatePromptSchema } from "@/data/types/validators/prompt";

import { PromptContentEdit } from "./content/prompt-content-edit";
import { PromptFollowUpsEdit } from "./follow-ups/prompt-follow-ups-edit";
import { BasicInfoEdit } from "./header/basic-info-edit";

type PromptEditProps = {
   prompt?: DPromptDescriptor;
   mode?: "create" | "edit";
};

export const PromptEdit: FC<PromptEditProps> = ({
   prompt,
   mode = "create",
}) => {
   const router = useRouter();
   const isEdit = mode === "edit" && !!prompt;

   const initValues = () => {
      if (isEdit) {
         return {
            id: prompt.id,
            title: prompt.title,
            content: prompt.content,
            categories: prompt.categories.map((c) => c.name),
            recommendedModel: prompt.recommendedModel,
            followUpPrompts: prompt.followUpPrompts.map((f) => f.content),
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
      fields: categories,
      append: addCategory,
      remove: removeCategory,
   } = useFieldArray({
      control: form.control,
      name: "categories" as never,
   });

   const {
      fields: followUpPrompts,
      append: addFollowUpPrompt,
      remove: removeFollowUpPrompt,
   } = useFieldArray({
      control: form.control,
      name: "followUpPrompts" as never,
   });

   const handleSave = async (createNewVersion: boolean = false) => {
      const isValid = await form.trigger();
      if (!isValid) {
         return;
      }
      const values = form.getValues();

      // Filter out empty strings from categories and followUpPrompts
      const filteredCategories = values.categories.filter(
         (cat) => cat.trim() !== ""
      );
      const filteredFollowUpPrompts = values.followUpPrompts.filter(
         (prompt) => prompt.trim() !== ""
      );

      const result = isEdit
         ? await updatePrompt(
              {
                 id: values.id!,
                 title: values.title,
                 content: values.content,
                 categories: filteredCategories,
                 recommendedModel: values.recommendedModel,
                 followUpPrompts: filteredFollowUpPrompts,
              },
              createNewVersion
           )
         : await createPrompt({
              ...values,
              categories: filteredCategories,
              followUpPrompts: filteredFollowUpPrompts,
           } as DPromptCreate);

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

   const onSubmit: SubmitHandler<DPromptUpdate> = async () => {
      await handleSave(false);
   };

   const actionBtns = () => {
      return (
         <div className="flex items-center justify-end gap-3 pt-2">
            <Button
               type="button"
               variant="outline"
               onClick={() => router.back()}
               disabled={form.formState.isSubmitting}
            >
               Abbrechen
            </Button>

            {isEdit ? (
               <div className="flex">
                  <Button
                     type="submit"
                     disabled={form.formState.isSubmitting}
                     className="rounded-r-none"
                  >
                     {form.formState.isSubmitting ? (
                        <>
                           <Loader className="h-4 w-4 animate-spin" />
                           Wird gespeichert...
                        </>
                     ) : (
                        <>
                           <Save className="h-4 w-4" />
                           Speichern
                        </>
                     )}
                  </Button>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           type="button"
                           disabled={form.formState.isSubmitting}
                           className="rounded-l-none border-l border-primary-foreground/20 px-2"
                        >
                           <ChevronDown className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem
                           onClick={() => handleSave(true)}
                           disabled={form.formState.isSubmitting}
                        >
                           <History className="h-4 w-4" />
                           Als neue Version speichern
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            ) : (
               <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                     <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Wird erstellt...
                     </>
                  ) : (
                     <>
                        <Save className="h-4 w-4" />
                        Prompt erstellen
                     </>
                  )}
               </Button>
            )}
         </div>
      );
   };

   return (
      <Card data-testid="prompt-edit">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               {isEdit ? "Prompt bearbeiten" : "Neuen Prompt erstellen"}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  data-testid="edit-form"
               >
                  <BasicInfoEdit
                     control={form.control}
                     register={form.register}
                     categories={categories}
                     addCategory={addCategory}
                     removeCategory={removeCategory}
                  />

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
