"use client";

import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { map } from "es-toolkit/compat";
import {
   ChevronDown,
   Cpu,
   FileText,
   History,
   Loader,
   MessageSquarePlus,
   Plus,
   Save,
   Tag,
   Type,
   X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
   ControllerRenderProps,
   SubmitHandler,
   useFieldArray,
   useForm,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { AutosizeTextarea } from "@/components/shadcn/autosize-textarea";
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
import { Separator } from "@/components/shadcn/separator";
import {
   createPrompt,
   updatePrompt,
} from "@/data/actions/prompt/prompt.actions";
import { DPromptCreate, DPromptDescriptor } from "@/data/types/domain/prompt";

const formSchema = z.object({
   id: z.string().optional(),
   title: z.string().min(3, "Titel muss mindestens 3 Zeichen lang sein"),
   content: z.string().min(1, "Inhalt ist erforderlich"),
   categories: z.array(z.string()),
   recommendedModel: z
      .string()
      .min(3, "Empfohlenes Modell muss mindestens 3 Zeichen lang sein"),
   followUpPrompts: z.array(z.string()),
});

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
      const result = isEditMode
         ? await updatePrompt({
              id: values.id!,
              title: values.title,
              content: values.content,
              categories: values.categories,
              recommendedModel: values.recommendedModel,
              followUpPrompts: values.followUpPrompts,
              createNewVersion,
           })
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

   const onSubmit: SubmitHandler<PromptFormValues> = async () => {
      await handleSave(false);
   };

   return (
      <Card data-testid="prompt-form">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               {isEditMode ? "Prompt bearbeiten" : "Neuen Prompt erstellen"}
            </CardTitle>
         </CardHeader>

         <CardContent className="pt-6">
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                  data-testid="edit-form"
               >
                  {/* Basic Information Section */}
                  <section className="space-y-4">
                     <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Type className="h-5 w-5 text-indigo-600" />
                        Allgemeine Informationen
                     </h3>

                     <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                           control={form.control}
                           name="title"
                           render={({
                              field,
                           }: {
                              field: ControllerRenderProps<
                                 PromptFormValues,
                                 "title"
                              >;
                           }) => (
                              <FormItem>
                                 <FormLabel className="text-sm font-medium text-slate-700">
                                    Titel
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Prompt-Titel eingeben..."
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="recommendedModel"
                           render={({
                              field,
                           }: {
                              field: ControllerRenderProps<
                                 PromptFormValues,
                                 "recommendedModel"
                              >;
                           }) => (
                              <FormItem>
                                 <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                    <Cpu className="h-4 w-4 text-indigo-600" />
                                    Empfohlenes Modell
                                 </FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Modell auswählen" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {AI_MODELS.map((model) => (
                                          <SelectItem key={model} value={model}>
                                             {model}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Categories Field */}
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                              <Tag className="h-4 w-4 text-indigo-600" />
                              Kategorien
                           </FormLabel>
                           <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addCategory("")}
                           >
                              <Plus className="h-4 w-4" />
                              Hinzufügen
                           </Button>
                        </div>

                        {categories.length > 0 ? (
                           <div className="space-y-2">
                              {map(categories, (field, index) => (
                                 <div key={field.id} className="flex gap-2">
                                    <Input
                                       {...form.register(`categories.${index}`)}
                                       placeholder="Kategoriename eingeben"
                                       className="flex-1"
                                    />
                                    <Button
                                       type="button"
                                       variant="outline"
                                       size="icon"
                                       onClick={() => removeCategory(index)}
                                       className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                    >
                                       <X className="h-4 w-4" />
                                    </Button>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-sm text-slate-500 italic">
                              Noch keine Kategorien hinzugefügt.
                           </p>
                        )}
                     </div>
                  </section>

                  <Separator />

                  {/* Prompt Content Section */}
                  <section className="space-y-4">
                     <div>
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                           <FileText className="h-5 w-5 text-indigo-600" />
                           Prompt
                        </h3>
                        {isEditMode && (
                           <p className="text-sm text-slate-500 mt-1">
                              Verwenden Sie &quot;Als neue Version
                              speichern&quot; um einen Versions-Snapshot zu
                              erstellen.
                           </p>
                        )}
                     </div>

                     <FormField
                        control={form.control}
                        name="content"
                        render={({
                           field,
                        }: {
                           field: ControllerRenderProps<
                              PromptFormValues,
                              "content"
                           >;
                        }) => (
                           <FormItem>
                              <FormControl>
                                 <AutosizeTextarea
                                    placeholder="Prompt-Inhalt eingeben..."
                                    minHeight={200}
                                    className="font-mono text-sm"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </section>

                  <Separator />

                  {/* Follow-up Prompts Section */}
                  <section className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                              <MessageSquarePlus className="h-5 w-5 text-indigo-600" />
                              Folge-Prompts
                           </h3>
                           <p className="text-sm text-slate-500 mt-1">
                              Vorgeschlagene Folgefragen, die Benutzer stellen
                              könnten.
                           </p>
                        </div>
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => addFollowUpPrompt("")}
                        >
                           <Plus className="h-4 w-4" />
                           Hinzufügen
                        </Button>
                     </div>

                     {followUpPrompts.length > 0 ? (
                        <div className="space-y-2">
                           {map(followUpPrompts, (field, idx) => (
                              <div key={field.id} className="flex gap-2">
                                 <Input
                                    {...form.register(`followUpPrompts.${idx}`)}
                                    placeholder="Folge-Prompt eingeben"
                                    className="flex-1"
                                 />
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeFollowUpPrompt(idx)}
                                    className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                 >
                                    <X className="h-4 w-4" />
                                 </Button>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-slate-500 italic">
                           Noch keine Folge-Prompts hinzugefügt.
                        </p>
                     )}
                  </section>

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
