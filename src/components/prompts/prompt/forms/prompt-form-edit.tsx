"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { map } from "es-toolkit/compat";
import { Loader, Plus, Save, X } from "lucide-react";
import {
   ControllerRenderProps,
   SubmitHandler,
   useFieldArray,
   useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { AutosizeTextarea } from "@/components/shadcn/autosize-textarea";
import { Button } from "@/components/shadcn/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { createPrompt, updatePrompt } from "@/data/actions/prompt/prompt.actions";
import { DPromptCreate, DPromptDescriptor, DPromptUpdate } from "@/data/types/domain/prompt";
import { createPromptSchema, updatePromptSchema } from "@/data/types/validators/prompt.schema";

const AI_MODELS = [
   "Claude Sonnet 4.5",
   "Claude Opus 4",
   "GPT-4",
   "GPT-4 Turbo",
   "GPT-3.5",
   "Gemini Pro",
   "Gemini Ultra",
   "Llama 3",
   "Mistral Large",
   "Other",
];

type PromptFormEditProps = {
   prompt?: DPromptDescriptor;
   mode?: "create" | "edit";
};

export const PromptFormEdit: FC<PromptFormEditProps> = ({
   prompt,
   mode = "create",
}) => {
   const router = useRouter();
   const isEditMode = mode === "edit" && prompt;

   const form = useForm<DPromptCreate | DPromptUpdate>({
      resolver: zodResolver(isEditMode ? updatePromptSchema : createPromptSchema),
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
      name: "categories",
   });

   const {
      fields: followUpPrompts,
      append: addFollowUpPrompt,
      remove: removeFollowUpPrompt,
   } = useFieldArray({
      control: form.control,
      name: "followUpPrompts",
   });

   const onSubmit: SubmitHandler<DPromptCreate | DPromptUpdate> = async (
      values
   ) => {
      const result = isEditMode
         ? await updatePrompt(values as DPromptUpdate)
         : await createPrompt(values as DPromptCreate);

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

   const editForm = () => {
      return (
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-4"
               data-testid="edit-form"
            >
               <div>
                  <FormField
                     control={form.control}
                     name="title"
                     render={({
                        field,
                     }: {
                        field: ControllerRenderProps<DPromptCreate, "title">;
                     }) => (
                        <FormItem className="w-full">
                           <FormLabel className="block text-sm font-medium mb-1 text-slate-700">
                              Title
                           </FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter prompt title..."
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <div>
                  <FormItem className="w-full">
                     <FormLabel className="block text-sm font-medium mb-1 text-slate-700">
                        Categories
                     </FormLabel>
                     <div className="space-y-3">
                        {map(categories, (field, index) => (
                           <div key={field.id} className="flex gap-2">
                              <Input
                                 {...form.register(`categories.${index}`)}
                                 placeholder="Enter category"
                                 className="flex-1"
                              />
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="icon"
                                 onClick={() => removeCategory(index)}
                                 className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                              >
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                     <div className="flex justify-end">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => addCategory("")}
                           className="mt-3"
                        >
                           <Plus className="h-4 w-4 mr-2" />
                           Add Category
                        </Button>
                     </div>
                  </FormItem>
               </div>

               <div>
                  <FormField
                     control={form.control}
                     name="recommendedModel"
                     render={({
                        field,
                     }: {
                        field: ControllerRenderProps<
                           DPromptCreate,
                           "recommendedModel"
                        >;
                     }) => (
                        <FormItem className="w-full">
                           <FormLabel className="block text-sm font-medium mb-1 text-slate-700">
                              Recommended AI Model
                           </FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              value={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a model" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {AI_MODELS.map((model) => (
                                    <SelectItem key={model} value={model}>
                                       {model.charAt(0).toUpperCase() +
                                          model.slice(1)}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <div>
                  <FormField
                     control={form.control}
                     name="content"
                     render={({
                        field,
                     }: {
                        field: ControllerRenderProps<DPromptCreate, "content">;
                     }) => (
                        <FormItem className="w-full">
                           <FormLabel className="block text-sm font-medium mb-1 text-slate-700">
                              Prompt Content
                           </FormLabel>
                           {isEditMode && (
                              <FormDescription>
                                 Changing the content will create a new version.
                              </FormDescription>
                           )}
                           <FormControl>
                              <AutosizeTextarea
                                 placeholder="Enter your prompt content..."
                                 minHeight={250}
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <div>
                  <FormItem className="w-full">
                     <FormLabel className="block text-sm font-medium mb-1 text-slate-700">
                        Follow-up Prompts
                     </FormLabel>
                     <FormDescription>
                        Add suggested follow-up questions or prompts that users
                        might want to ask next.
                     </FormDescription>
                     <div className="space-y-3">
                        {map(followUpPrompts, (field, idx) => (
                           <div key={field.id} className="flex gap-2">
                              <Input
                                 {...form.register(`followUpPrompts.${idx}`)}
                                 placeholder="Enter follow-up prompt"
                                 className="flex-1"
                              />
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="icon"
                                 onClick={() => removeFollowUpPrompt(idx)}
                                 className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                              >
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                     <div className="flex justify-end">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => addFollowUpPrompt("")}
                           className="mt-3"
                        >
                           <Plus className="h-4 w-4 mr-2" />
                           Add Follow-up Prompt
                        </Button>
                     </div>
                  </FormItem>
               </div>

               <div className="flex gap-3">
                  <Button
                     type="submit"
                     disabled={form.formState.isSubmitting}
                     className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                     {form.formState.isSubmitting ? (
                        <>
                           <Loader className="w-4 h-4 animate-spin" />
                           {isEditMode ? "Saving..." : "Creating..."}
                        </>
                     ) : (
                        <>
                           <Save className="w-4 h-4" />
                           {isEditMode ? "Save Changes" : "Create Prompt"}
                        </>
                     )}
                  </Button>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => router.back()}
                     disabled={form.formState.isSubmitting}
                     className="px-6 py-3"
                  >
                     Cancel
                  </Button>
               </div>
            </form>
         </Form>
      );
   };

   return (
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm" data-testid="prompt-form">
         {editForm()}
      </div>
   );
};
