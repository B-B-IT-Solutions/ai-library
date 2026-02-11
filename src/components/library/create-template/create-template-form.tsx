"use client";

import { FC, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   AlertCircle,
   CheckCircle2,
   FileText,
   Loader,
   Plus,
   RefreshCw,
   Save,
   Settings,
   Sparkles,
   Trash2,
   X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   Form,
   FormControl,
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
import { Textarea } from "@/components/shadcn/textarea";
import { MDEditor } from "@/components/shared/md";
import { createCustomTemplate } from "@/data/actions/library";

const FIELD_TYPES = [
   { value: "TEXT", label: "Text" },
   { value: "TEXTAREA", label: "Textarea" },
   { value: "EMAIL", label: "E-Mail" },
   { value: "NUMBER", label: "Nummer" },
   { value: "DATE", label: "Datum" },
   { value: "SELECT", label: "Auswahl" },
   { value: "CHECKBOX", label: "Checkbox" },
   { value: "RADIO", label: "Radio" },
];

const RECOMMENDED_MODELS = [
   "Claude 3.5 Sonnet",
   "Claude 3 Opus",
   "GPT-4",
   "GPT-4 Turbo",
   "GPT-3.5 Turbo",
];

const templateFieldSchema = z.object({
   name: z.string().min(1, "Feldname ist erforderlich"),
   label: z.string().min(1, "Label ist erforderlich"),
   description: z.string().optional(),
   type: z.string(),
   required: z.boolean(),
   order: z.number(),
   defaultValue: z.string().optional(),
   options: z.array(z.string()).optional(),
});

const createTemplateSchema = z.object({
   title: z.string().min(1, "Titel ist erforderlich"),
   description: z.string().min(1, "Beschreibung ist erforderlich"),
   detailedDescription: z
      .string()
      .min(1, "Detaillierte Beschreibung ist erforderlich"),
   content: z.string().min(1, "Prompt-Vorlage ist erforderlich"),
   recommendedModel: z.string().min(1, "Modell ist erforderlich"),
   categories: z.array(z.string()),
   categoryInput: z.string().optional(),
   fields: z.array(templateFieldSchema),
});

type FormData = z.infer<typeof createTemplateSchema>;

// Helper function to extract variables from template content
const extractVariablesFromContent = (content: string): string[] => {
   const regex = /\{\{(\w+)\}\}/g;
   const variables = new Set<string>();
   let match;

   while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
   }

   return Array.from(variables);
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
   return str.charAt(0).toUpperCase() + str.slice(1);
};

export const CreateTemplateForm: FC = () => {
   const router = useRouter();

   const form = useForm<FormData>({
      resolver: zodResolver(createTemplateSchema),
      defaultValues: {
         title: "",
         description: "",
         content: "",
         detailedDescription: "",
         recommendedModel: "Claude 3.5 Sonnet",
         categories: [],
         categoryInput: "",
         fields: [],
      },
   });

   const {
      fields,
      append: addField,
      remove: removeField,
   } = useFieldArray({
      control: form.control,
      name: "fields",
   });

   const categories = form.watch("categories");
   const categoryInput = form.watch("categoryInput");
   const content = form.watch("content");

   // Extract variables from content
   const detectedVariables = useMemo(
      () => extractVariablesFromContent(content || ""),
      [content]
   );

   // Determine variable status
   const variableStatus = useMemo(() => {
      const fieldNames = fields.map((f) => form.getValues(`fields.${fields.indexOf(f)}.name`));

      return {
         // Variables in content that don't have fields defined
         undefined: detectedVariables.filter(
            (varName) => !fieldNames.includes(varName)
         ),
         // Fields that are used in content
         used: fieldNames.filter((fieldName) =>
            detectedVariables.includes(fieldName)
         ),
         // Fields that are not used in content
         unused: fieldNames.filter(
            (fieldName) => !detectedVariables.includes(fieldName)
         ),
      };
   }, [detectedVariables, fields, form]);

   const handleAddCategory = () => {
      if (categoryInput?.trim() && !categories.includes(categoryInput.trim())) {
         form.setValue("categories", [...categories, categoryInput.trim()]);
         form.setValue("categoryInput", "");
      }
   };

   const handleRemoveCategory = (category: string) => {
      form.setValue(
         "categories",
         categories.filter((c) => c !== category)
      );
   };

   const handleAddField = () => {
      addField({
         name: "",
         label: "",
         description: "",
         type: "TEXT",
         required: true,
         order: fields.length,
         defaultValue: "",
         options: [],
      });
   };

   const handleAddVariableAsField = (variableName: string) => {
      addField({
         name: variableName,
         label: capitalizeFirstLetter(variableName),
         description: "",
         type: "TEXT",
         required: true,
         order: fields.length,
         defaultValue: "",
         options: [],
      });
      toast.success(`Feld "${variableName}" hinzugefügt`);
   };

   const handleSyncAllVariables = () => {
      let addedCount = 0;
      variableStatus.undefined.forEach((varName) => {
         handleAddVariableAsField(varName);
         addedCount++;
      });

      if (addedCount > 0) {
         toast.success(`${addedCount} Feld(er) synchronisiert`);
      } else {
         toast.info("Alle Variablen sind bereits definiert");
      }
   };

   const onSubmit: SubmitHandler<FormData> = async (data) => {
      const result = await createCustomTemplate({
         title: data.title,
         description: data.description,
         content: data.content,
         detailedDescription: data.detailedDescription,
         recommendedModel: data.recommendedModel,
         categories: data.categories,
         fields: data.fields,
      });

      if (result.success) {
         toast.success(result.message);
         router.push("/library");
         router.refresh();
      } else {
         toast.error(result.message);
      }
   };

   const actionButtons = () => {
      return (
         <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/library">
               <Button
                  type="button"
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                  data-testid="cancel-btn"
               >
                  Abbrechen
               </Button>
            </Link>
            <Button
               type="submit"
               disabled={form.formState.isSubmitting}
               data-testid="create-btn"
            >
               {form.formState.isSubmitting ? (
                  <>
                     <Loader className="h-4 w-4 animate-spin" />
                     Wird erstellt...
                  </>
               ) : (
                  <>
                     <Save className="h-4 w-4" />
                     Vorlage erstellen
                  </>
               )}
            </Button>
         </div>
      );
   };

   return (
      <Card data-testid="create-template-form">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               Neue Vorlage erstellen
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  data-testid="template-form"
               >
                  {/* Basic Information */}
                  <section className="space-y-4">
                     <div>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                           <Settings className="h-5 w-5 text-indigo-600" />
                           Grundlegende Informationen
                        </h3>
                     </div>

                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Titel *</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="z.B. Blog-Post Generator"
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
                              <FormLabel>Beschreibung *</FormLabel>
                              <FormControl>
                                 <Textarea
                                    {...field}
                                    placeholder="Kurze Beschreibung der Vorlage"
                                    rows={3}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="detailedDescription"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Detaillierte Beschreibung *</FormLabel>
                              <FormControl>
                                 <Textarea
                                    {...field}
                                    placeholder="Ausführliche Beschreibung der Vorlage"
                                    rows={4}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="recommendedModel"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Empfohlenes Modell *</FormLabel>
                              <Select
                                 value={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {RECOMMENDED_MODELS.map((model) => (
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

                     <FormField
                        control={form.control}
                        name="categoryInput"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Kategorien</FormLabel>
                              <div className="flex gap-2">
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="Kategorie hinzufügen"
                                       onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                             e.preventDefault();
                                             handleAddCategory();
                                          }
                                       }}
                                    />
                                 </FormControl>
                                 <Button
                                    type="button"
                                    onClick={handleAddCategory}
                                    variant="outline"
                                 >
                                    Hinzufügen
                                 </Button>
                              </div>
                              {categories.length > 0 && (
                                 <div className="mt-2 flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                       <div
                                          key={category}
                                          className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"
                                       >
                                          <span className="text-sm">
                                             {category}
                                          </span>
                                          <button
                                             type="button"
                                             onClick={() =>
                                                handleRemoveCategory(category)
                                             }
                                             className="text-slate-500 hover:text-slate-700"
                                          >
                                             <X className="h-3 w-3" />
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </FormItem>
                        )}
                     />
                  </section>

                  <Separator />

                  {/* Prompt Template Content */}
                  <section className="space-y-4">
                     <div>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                           <FileText className="h-5 w-5 text-indigo-600" />
                           Prompt-Vorlage
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                           Verwenden Sie{" "}
                           <code className="rounded bg-slate-100 px-1 py-0.5">
                              {`{{feldname}}`}
                           </code>{" "}
                           für Platzhalter, die durch Ihre Felder ersetzt werden
                        </p>
                     </div>

                     <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Verwenden Sie {{feldname}} für Platzhalter, z.B. 'Schreibe einen Blog-Post über {{thema}}'"
                                    minHeight={250}
                                    data-testid="template-editor"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </section>

                  <Separator />

                  {/* Detected Variables */}
                  {detectedVariables.length > 0 && (
                     <>
                        <section className="space-y-4">
                           <div>
                              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                 <Sparkles className="h-5 w-5 text-indigo-600" />
                                 Erkannte Variablen
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                 Variablen, die in Ihrer Prompt-Vorlage gefunden
                                 wurden
                              </p>
                           </div>

                           <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                              <div className="mb-3 flex items-center justify-between">
                                 <div className="text-sm text-slate-700">
                                    <span className="font-medium">
                                       {detectedVariables.length}
                                    </span>{" "}
                                    Variable(n) im Content gefunden
                                 </div>
                                 {variableStatus.undefined.length > 0 && (
                                    <Button
                                       type="button"
                                       onClick={handleSyncAllVariables}
                                       variant="outline"
                                       size="sm"
                                    >
                                       <RefreshCw className="mr-2 h-3 w-3" />
                                       Alle synchronisieren
                                    </Button>
                                 )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                 {detectedVariables.map((varName) => {
                                    const isDefined =
                                       !variableStatus.undefined.includes(
                                          varName
                                       );
                                    return (
                                       <div
                                          key={varName}
                                          className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
                                             isDefined
                                                ? "border-green-200 bg-green-50 text-green-900"
                                                : "border-orange-200 bg-orange-50 text-orange-900"
                                          }`}
                                       >
                                          {isDefined ? (
                                             <CheckCircle2 className="h-4 w-4 text-green-600" />
                                          ) : (
                                             <AlertCircle className="h-4 w-4 text-orange-600" />
                                          )}
                                          <code className="text-sm font-mono">
                                             {`{{${varName}}}`}
                                          </code>
                                          {!isDefined && (
                                             <Button
                                                type="button"
                                                onClick={() =>
                                                   handleAddVariableAsField(
                                                      varName
                                                   )
                                                }
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2 h-6 px-2 text-xs"
                                             >
                                                <Plus className="mr-1 h-3 w-3" />
                                                Hinzufügen
                                             </Button>
                                          )}
                                       </div>
                                    );
                                 })}
                              </div>

                              {variableStatus.undefined.length > 0 && (
                                 <div className="mt-3 rounded-md bg-orange-100 p-3 text-sm text-orange-800">
                                    <div className="flex items-center gap-2">
                                       <AlertCircle className="h-4 w-4" />
                                       <span>
                                          {variableStatus.undefined.length}{" "}
                                          Variable(n) noch nicht als Feld
                                          definiert
                                       </span>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </section>
                        <Separator />
                     </>
                  )}

                  {/* Template Fields */}
                  <section className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-lg font-semibold text-slate-900">
                              Vorlagen-Felder
                           </h3>
                           <p className="mt-1 text-sm text-slate-500">
                              Definieren Sie Felder, die Benutzer ausfüllen
                              können
                           </p>
                        </div>
                        <Button
                           type="button"
                           onClick={handleAddField}
                           variant="outline"
                           size="sm"
                        >
                           <Plus className="mr-2 h-4 w-4" />
                           Feld hinzufügen
                        </Button>
                     </div>

                     {fields.length === 0 && (
                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                           <p className="text-slate-500">
                              Noch keine Felder hinzugefügt
                           </p>
                           <p className="mt-1 text-sm text-slate-400">
                              Klicken Sie auf &quot;Feld hinzufügen&quot;, um zu
                              beginnen
                           </p>
                        </div>
                     )}

                     <div className="space-y-4">
                        {fields.map((field, index) => {
                           const fieldName = form.watch(`fields.${index}.name`);
                           const isUsedInContent =
                              detectedVariables.includes(fieldName);
                           const hasName = fieldName && fieldName.trim() !== "";

                           return (
                              <div
                                 key={field.id}
                                 className={`rounded-lg border p-6 ${
                                    hasName && !isUsedInContent
                                       ? "border-orange-200 bg-orange-50"
                                       : hasName && isUsedInContent
                                         ? "border-green-200 bg-green-50"
                                         : "border-slate-200 bg-slate-50"
                                 }`}
                              >
                                 <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <h4 className="font-medium text-slate-900">
                                          Feld {index + 1}
                                       </h4>
                                       {hasName && isUsedInContent && (
                                          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                             <CheckCircle2 className="h-3 w-3" />
                                             Im Content verwendet
                                          </span>
                                       )}
                                       {hasName && !isUsedInContent && (
                                          <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                                             <AlertCircle className="h-3 w-3" />
                                             Nicht verwendet
                                          </span>
                                       )}
                                    </div>
                                    <Button
                                       type="button"
                                       onClick={() => removeField(index)}
                                       variant="ghost"
                                       size="sm"
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <FormField
                                    control={form.control}
                                    name={`fields.${index}.name`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Feldname *</FormLabel>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                placeholder="z.B. thema"
                                             />
                                          </FormControl>
                                          <p className="mt-1 text-xs text-slate-500">
                                             Verwenden Sie diesen Namen als{" "}
                                             {`{{${field.value || "feldname"}}}`}
                                          </p>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name={`fields.${index}.label`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Label *</FormLabel>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                placeholder="z.B. Thema"
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name={`fields.${index}.type`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Feldtyp *</FormLabel>
                                          <Select
                                             value={field.value}
                                             onValueChange={field.onChange}
                                          >
                                             <FormControl>
                                                <SelectTrigger>
                                                   <SelectValue />
                                                </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                {FIELD_TYPES.map((type) => (
                                                   <SelectItem
                                                      key={type.value}
                                                      value={type.value}
                                                   >
                                                      {type.label}
                                                   </SelectItem>
                                                ))}
                                             </SelectContent>
                                          </Select>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name={`fields.${index}.defaultValue`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Standardwert</FormLabel>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                placeholder="Optional"
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name={`fields.${index}.description`}
                                    render={({ field }) => (
                                       <FormItem className="col-span-2">
                                          <FormLabel>Beschreibung</FormLabel>
                                          <FormControl>
                                             <Textarea
                                                {...field}
                                                placeholder="Optionale Beschreibung für das Feld"
                                                rows={2}
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name={`fields.${index}.required`}
                                    render={({ field }) => (
                                       <FormItem className="col-span-2 flex items-center space-y-0 space-x-2">
                                          <FormControl>
                                             <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                             />
                                          </FormControl>
                                          <FormLabel className="cursor-pointer font-normal">
                                             Dieses Feld ist erforderlich
                                          </FormLabel>
                                       </FormItem>
                                    )}
                                 />
                              </div>
                              </div>
                           );
                        })}
                     </div>
                  </section>

                  <Separator />
                  {actionButtons()}
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
