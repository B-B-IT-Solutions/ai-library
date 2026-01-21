"use client";

import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, History, Loader, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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
import { DPromptCreate, DPromptDescriptor } from "@/data/types/domain/prompt";

import { BasicInformationSection } from "./basic-information-section";
import { PromptContentEdit } from "./content/prompt-content-edit";
import { FollowUpPromptsEdit } from "./follow-ups/follow-up-prompts-edit";

const formSchema = z.object({
   id: z.string().optional(),
   title: z.string().min(3, "Titel ist erforderlich"),
   content: z.string(),
   categories: z.array(z.string()),
   recommendedModel: z.string(),
   followUpPrompts: z.array(z.string()),
});

type PromptEditProps = {
   prompt?: DPromptDescriptor;
   mode?: "create" | "edit";
};

type PromptFormValues = z.infer<typeof formSchema>;

export const PromptEdit: FC<PromptEditProps> = ({
   prompt,
   mode = "create",
}) => {
   const router = useRouter();
   const isEditMode = mode === "edit" && !!prompt;

   const form = useForm<PromptFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: isEditMode
         ? {
              id: prompt.id,
              title: prompt.title,
              content: prompt.content,
              categories: prompt.categories.map((c) => c.name),
              recommendedModel: prompt.recommendedModel,
              followUpPrompts: prompt.followUpPrompts.map((f) => f.content),
           }
         : {
              title: "",
              content: "",
              categories: [],
              recommendedModel: "",
              followUpPrompts: [],
           },
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
      if (!isValid) return;

      const values = form.getValues();

      // Filter out empty strings from categories and followUpPrompts
      const filteredCategories = values.categories.filter(
         (cat) => cat.trim() !== ""
      );
      const filteredFollowUpPrompts = values.followUpPrompts.filter(
         (prompt) => prompt.trim() !== ""
      );

      const result = isEditMode
         ? await updatePrompt({
              id: values.id!,
              title: values.title,
              content: values.content,
              categories: filteredCategories,
              recommendedModel: values.recommendedModel,
              followUpPrompts: filteredFollowUpPrompts,
              createNewVersion,
           })
         : await createPrompt({
              ...values,
              categories: filteredCategories,
              followUpPrompts: filteredFollowUpPrompts,
           } as DPromptCreate);

      if (result.success) {
         toast.success(result.message);
         if (isEditMode) {
            router.push(`/prompts/${prompt.id}`);
         } else {
            router.push("/prompts");
         }
      } else {
         toast.error(result.message);
      }
   };

   const onSubmit: SubmitHandler<PromptFormValues> = async () => {
      await handleSave(false);
   };

   return (
      <Card data-testid="prompt-edit">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               {isEditMode ? "Prompt bearbeiten" : "Neuen Prompt erstellen"}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  data-testid="edit-form"
               >
                  {/* Basic Information Section */}
                  <BasicInformationSection
                     control={form.control}
                     register={form.register}
                     categories={categories}
                     addCategory={addCategory}
                     removeCategory={removeCategory}
                  />

                  <Separator />

                  {/* Prompt Content Section */}
                  <PromptContentEdit
                     control={form.control}
                     isEdit={isEditMode}
                  />

                  <Separator />

                  {/* Follow-up Prompts Section */}
                  <FollowUpPromptsEdit
                     control={form.control}
                     followUpPrompts={followUpPrompts}
                     addFollowUpPrompt={addFollowUpPrompt}
                     removeFollowUpPrompt={removeFollowUpPrompt}
                  />

                  <Separator />

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={form.formState.isSubmitting}
                     >
                        Abbrechen
                     </Button>

                     {isEditMode ? (
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
                        <Button
                           type="submit"
                           disabled={form.formState.isSubmitting}
                        >
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
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
