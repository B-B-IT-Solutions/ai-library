"use client";

import { FC, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import {
   createCustomTemplate,
   CreateCustomTemplateInput,
} from "@/data/actions/library";

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

type FormData = Omit<CreateCustomTemplateInput, "categories"> & {
   categoryInput: string;
   categories: string[];
};

export const CreateTemplateForm: FC = () => {
   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
   } = useForm<FormData>({
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

   const { fields, append, remove } = useFieldArray({
      control,
      name: "fields",
   });

   const categories = watch("categories");
   const categoryInput = watch("categoryInput");

   const handleAddCategory = () => {
      if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
         setValue("categories", [...categories, categoryInput.trim()]);
         setValue("categoryInput", "");
      }
   };

   const handleRemoveCategory = (category: string) => {
      setValue(
         "categories",
         categories.filter((c) => c !== category)
      );
   };

   const handleAddField = () => {
      append({
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

   const onSubmit = async (data: FormData) => {
      setIsSubmitting(true);
      try {
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
      } catch (error) {
         toast.error("Ein Fehler ist aufgetreten");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
               <div>
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                     Grundlegende Informationen
                  </h2>
                  <div className="space-y-4">
                     <div>
                        <Label htmlFor="title">Titel *</Label>
                        <Input
                           id="title"
                           {...register("title", {
                              required: "Titel ist erforderlich",
                           })}
                           placeholder="z.B. Blog-Post Generator"
                           className="mt-1"
                        />
                        {errors.title && (
                           <p className="mt-1 text-sm text-red-500">
                              {errors.title.message}
                           </p>
                        )}
                     </div>

                     <div>
                        <Label htmlFor="description">Beschreibung *</Label>
                        <Textarea
                           id="description"
                           {...register("description", {
                              required: "Beschreibung ist erforderlich",
                           })}
                           placeholder="Kurze Beschreibung der Vorlage"
                           rows={3}
                           className="mt-1"
                        />
                        {errors.description && (
                           <p className="mt-1 text-sm text-red-500">
                              {errors.description.message}
                           </p>
                        )}
                     </div>

                     <div>
                        <Label htmlFor="detailedDescription">
                           Detaillierte Beschreibung *
                        </Label>
                        <Textarea
                           id="detailedDescription"
                           {...register("detailedDescription", {
                              required:
                                 "Detaillierte Beschreibung ist erforderlich",
                           })}
                           placeholder="Ausführliche Beschreibung der Vorlage"
                           rows={4}
                           className="mt-1"
                        />
                        {errors.detailedDescription && (
                           <p className="mt-1 text-sm text-red-500">
                              {errors.detailedDescription.message}
                           </p>
                        )}
                     </div>

                     <div>
                        <Label htmlFor="recommendedModel">
                           Empfohlenes Modell *
                        </Label>
                        <Controller
                           name="recommendedModel"
                           control={control}
                           render={({ field }) => (
                              <Select
                                 value={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <SelectTrigger className="mt-1">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {RECOMMENDED_MODELS.map((model) => (
                                       <SelectItem key={model} value={model}>
                                          {model}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           )}
                        />
                     </div>

                     <div>
                        <Label htmlFor="categoryInput">Kategorien</Label>
                        <div className="mt-1 flex gap-2">
                           <Input
                              id="categoryInput"
                              {...register("categoryInput")}
                              placeholder="Kategorie hinzufügen"
                              onKeyDown={(e) => {
                                 if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCategory();
                                 }
                              }}
                           />
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
                                    <span className="text-sm">{category}</span>
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
                     </div>
                  </div>
               </div>
            </div>

            {/* Prompt Template Section */}
            <div className="border-t border-slate-200 pt-8">
               <div className="space-y-4">
                  <div>
                     <h2 className="mb-4 text-xl font-semibold text-slate-900">
                        Prompt-Vorlage
                     </h2>
                     <div>
                        <Label htmlFor="content">Prompt-Inhalt *</Label>
                        <Textarea
                           id="content"
                           {...register("content", {
                              required: "Prompt-Vorlage ist erforderlich",
                           })}
                           placeholder="Verwenden Sie {{feldname}} für Platzhalter, z.B. 'Schreibe einen Blog-Post über {{thema}}'"
                           rows={8}
                           className="mt-1 font-mono text-sm"
                        />
                        {errors.content && (
                           <p className="mt-1 text-sm text-red-500">
                              {errors.content.message}
                           </p>
                        )}
                        <p className="mt-2 text-sm text-slate-500">
                           Verwenden Sie doppelte geschweifte Klammern{" "}
                           <code className="rounded bg-slate-100 px-1 py-0.5">
                              {`{{feldname}}`}
                           </code>{" "}
                           für Platzhalter, die durch Ihre Felder ersetzt werden
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Template Fields Section */}
            <div className="border-t border-slate-200 pt-8">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                           Vorlagen-Felder
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                           Definieren Sie Felder, die Benutzer ausfüllen können
                        </p>
                     </div>
                     <Button
                        type="button"
                        onClick={handleAddField}
                        variant="outline"
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
                     {fields.map((field, index) => (
                        <div
                           key={field.id}
                           className="rounded-lg border border-slate-200 bg-slate-50 p-6"
                        >
                           <div className="mb-4 flex items-center justify-between">
                              <h3 className="font-medium text-slate-900">
                                 Feld {index + 1}
                              </h3>
                              <Button
                                 type="button"
                                 onClick={() => remove(index)}
                                 variant="ghost"
                                 size="sm"
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <Label htmlFor={`fields.${index}.name`}>
                                    Feldname *
                                 </Label>
                                 <Input
                                    {...register(`fields.${index}.name`, {
                                       required: "Feldname ist erforderlich",
                                    })}
                                    placeholder="z.B. thema"
                                    className="mt-1"
                                 />
                                 {errors.fields?.[index]?.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                       {errors.fields[index]?.name?.message}
                                    </p>
                                 )}
                                 <p className="mt-1 text-xs text-slate-500">
                                    Verwenden Sie diesen Namen in der Vorlage
                                    als {`{{feldname}}`}
                                 </p>
                              </div>

                              <div>
                                 <Label htmlFor={`fields.${index}.label`}>
                                    Label *
                                 </Label>
                                 <Input
                                    {...register(`fields.${index}.label`, {
                                       required: "Label ist erforderlich",
                                    })}
                                    placeholder="z.B. Thema"
                                    className="mt-1"
                                 />
                                 {errors.fields?.[index]?.label && (
                                    <p className="mt-1 text-sm text-red-500">
                                       {errors.fields[index]?.label?.message}
                                    </p>
                                 )}
                              </div>

                              <div>
                                 <Label htmlFor={`fields.${index}.type`}>
                                    Feldtyp *
                                 </Label>
                                 <Controller
                                    name={`fields.${index}.type`}
                                    control={control}
                                    render={({ field }) => (
                                       <Select
                                          value={field.value}
                                          onValueChange={field.onChange}
                                       >
                                          <SelectTrigger className="mt-1">
                                             <SelectValue />
                                          </SelectTrigger>
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
                                    )}
                                 />
                              </div>

                              <div>
                                 <Label
                                    htmlFor={`fields.${index}.defaultValue`}
                                 >
                                    Standardwert
                                 </Label>
                                 <Input
                                    {...register(
                                       `fields.${index}.defaultValue`
                                    )}
                                    placeholder="Optional"
                                    className="mt-1"
                                 />
                              </div>

                              <div className="col-span-2">
                                 <Label htmlFor={`fields.${index}.description`}>
                                    Beschreibung
                                 </Label>
                                 <Textarea
                                    {...register(`fields.${index}.description`)}
                                    placeholder="Optionale Beschreibung für das Feld"
                                    rows={2}
                                    className="mt-1"
                                 />
                              </div>

                              <div className="col-span-2">
                                 <div className="flex items-center space-x-2">
                                    <Controller
                                       name={`fields.${index}.required`}
                                       control={control}
                                       render={({ field }) => (
                                          <Checkbox
                                             id={`fields.${index}.required`}
                                             checked={field.value}
                                             onCheckedChange={field.onChange}
                                          />
                                       )}
                                    />
                                    <Label
                                       htmlFor={`fields.${index}.required`}
                                       className="cursor-pointer"
                                    >
                                       Dieses Feld ist erforderlich
                                    </Label>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end border-t border-slate-200 pt-6">
               <div className="flex gap-3">
                  <Link href="/library">
                     <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                     >
                        Abbrechen
                     </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Erstelle..." : "Vorlage erstellen"}
                  </Button>
               </div>
            </div>
         </form>
      </div>
   );
};
