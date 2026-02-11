"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { Checkbox } from "@/components/shadcn/checkbox";
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
         <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
               <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">
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
                           <p className="text-sm text-red-500 mt-1">
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
                           <p className="text-sm text-red-500 mt-1">
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
                           <p className="text-sm text-red-500 mt-1">
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
                        <div className="flex gap-2 mt-1">
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
                           <div className="flex flex-wrap gap-2 mt-2">
                              {categories.map((category) => (
                                 <div
                                    key={category}
                                    className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2"
                                 >
                                    <span className="text-sm">{category}</span>
                                    <button
                                       type="button"
                                       onClick={() =>
                                          handleRemoveCategory(category)
                                       }
                                       className="text-slate-500 hover:text-slate-700"
                                    >
                                       <X className="w-3 h-3" />
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
                     <h2 className="text-xl font-semibold text-slate-900 mb-4">
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
                           <p className="text-sm text-red-500 mt-1">
                              {errors.content.message}
                           </p>
                        )}
                        <p className="text-sm text-slate-500 mt-2">
                           Verwenden Sie doppelte geschweifte Klammern{" "}
                           <code className="bg-slate-100 px-1 py-0.5 rounded">
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
                  <div className="flex justify-between items-center">
                     <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                           Vorlagen-Felder
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                           Definieren Sie Felder, die Benutzer ausfüllen können
                        </p>
                     </div>
                     <Button
                        type="button"
                        onClick={handleAddField}
                        variant="outline"
                     >
                        <Plus className="w-4 h-4 mr-2" />
                        Feld hinzufügen
                     </Button>
                  </div>

                  {fields.length === 0 && (
                     <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                        <p className="text-slate-500">
                           Noch keine Felder hinzugefügt
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                           Klicken Sie auf &quot;Feld hinzufügen&quot;, um zu
                           beginnen
                        </p>
                     </div>
                  )}

                  <div className="space-y-4">
                     {fields.map((field, index) => (
                        <div
                           key={field.id}
                           className="border border-slate-200 rounded-lg p-6 bg-slate-50"
                        >
                           <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-slate-900">
                                 Feld {index + 1}
                              </h3>
                              <Button
                                 type="button"
                                 onClick={() => remove(index)}
                                 variant="ghost"
                                 size="sm"
                              >
                                 <Trash2 className="w-4 h-4" />
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
                                    <p className="text-sm text-red-500 mt-1">
                                       {errors.fields[index]?.name?.message}
                                    </p>
                                 )}
                                 <p className="text-xs text-slate-500 mt-1">
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
                                    <p className="text-sm text-red-500 mt-1">
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
                                    {...register(
                                       `fields.${index}.description`
                                    )}
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
            <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
               <Link href="/library">
                  <Button
                     type="button"
                     variant="ghost"
                     disabled={isSubmitting}
                  >
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Zurück zur Bibliothek
                  </Button>
               </Link>
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
