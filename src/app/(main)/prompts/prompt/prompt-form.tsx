"use client";

import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { map } from "es-toolkit/compat";
import {
   Check,
   ChevronDown,
   ChevronRight,
   Copy,
   Edit2,
   Plus,
   Save,
   Tag,
   X,
} from "lucide-react";
import { ControllerRenderProps, useFieldArray, useForm } from "react-hook-form";

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
import { createPrompt } from "@/data/actions/prompt/prompt.actions";
import { DPrompt, DPromptCreate } from "@/data/types/domain/prompt";
import { createPromptSchema } from "@/data/types/validators/prompt.schema";

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

type PromptFomProps = {
   prompt: DPrompt | null;
};

export const PromptFom: FC<PromptFomProps> = ({ prompt }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [expandedVersions, setExpandedVersions] = useState({});

   const [conentExpanded, setContentExpanded] = useState(false);
   const [followUpsExpanded, setFollowupsExpaned] = useState(false);
   const [copiedItem, setCopiedItem] = useState<string | null>(null);

   const form = useForm<DPromptCreate>({
      resolver: zodResolver(createPromptSchema),
      defaultValues: prompt || {
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

   const savePrompt = () => {
      const newPrompt = form.getValues();
      createPrompt(newPrompt);
   };

   const startEdit = () => {
      setIsEditing(true);
   };

   const copyToClipboard = async (text: string, itemId: string) => {
      try {
         await navigator.clipboard.writeText(text);
         setCopiedItem(itemId);
         setTimeout(() => setCopiedItem(null), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   const toggleVersionExpand = (promptId: string) => {
      setExpandedVersions((prev) => ({
         ...prev,
         [promptId]: !prev[promptId],
      }));
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   const editForm = () => {
      return (
         <Form {...form}>
            <div className="space-y-4" data-testid="edit-form">
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

               <button
                  onClick={savePrompt}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
               >
                  <Save className="w-4 h-4" />
                  {prompt ? "Save New Version" : "Create Prompt"}
               </button>
            </div>
         </Form>
      );
   };

   const viewForm = (prompt: DPrompt) => {
      return (
         <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900">
                     {prompt.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                     {prompt.categories.map((cat) => (
                        <span
                           key={cat}
                           className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                        >
                           <Tag className="w-3 h-3" />
                           {cat}
                        </span>
                     ))}
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                     <div>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(prompt.createdAt)}
                     </div>
                     <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDate(prompt.updatedAt)}
                     </div>
                     <div>
                        <span className="font-medium">Current Version:</span> v
                        {prompt.currentVersion}
                     </div>
                     {prompt.recommendedModel && (
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-blue-700 font-medium">
                              🤖 Recommended Model:
                           </span>
                           <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                              {prompt.recommendedModel}
                           </span>
                        </div>
                     )}
                  </div>
               </div>
               <button
                  onClick={startEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
               >
                  <Edit2 className="w-4 h-4" />
                  Edit
               </button>
            </div>

            {/* Current Prompt Content - Foldable */}
            <div className="mb-6">
               <div
                  onClick={() => setContentExpanded(!conentExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
               >
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                     Current Prompt Content
                  </span>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           copyToClipboard(prompt.content, "current-prompt");
                        }}
                        className="p-2 hover:bg-slate-200 rounded transition-colors"
                        title="Copy to clipboard"
                     >
                        {copiedItem === "current-prompt" ? (
                           <Check className="w-4 h-4 text-green-600" />
                        ) : (
                           <Copy className="w-4 h-4 text-slate-600" />
                        )}
                     </button>
                     {conentExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                     ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                     )}
                  </div>
               </div>

               {conentExpanded && (
                  <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg">
                     <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                        {prompt.content}
                     </pre>
                  </div>
               )}
            </div>

            {/* Follow-up Prompts Section */}
            {prompt.followUpPrompts && prompt.followUpPrompts.length > 0 && (
               <div className="mb-6">
                  <button
                     onClick={() => setFollowupsExpaned(!followUpsExpanded)}
                     className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                     <span className="font-semibold text-slate-900 flex items-center gap-2">
                        Follow-up Prompts ({prompt.followUpPrompts.length})
                     </span>
                     {followUpsExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                     ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                     )}
                  </button>

                  {followUpsExpanded && (
                     <div className="mt-2 space-y-2">
                        {prompt.followUpPrompts.map((followUp, idx) => (
                           <div
                              key={idx}
                              className="p-3 bg-blue-50 border border-blue-200 rounded-lg group"
                           >
                              <div className="flex items-start gap-2">
                                 <span className="text-blue-600 font-medium text-sm mt-0.5">
                                    {idx + 1}.
                                 </span>
                                 <p className="text-sm text-slate-700 flex-1">
                                    {followUp}
                                 </p>
                                 <button
                                    onClick={() =>
                                       copyToClipboard(
                                          followUp,
                                          `followup-${idx}`
                                       )
                                    }
                                    className="p-1.5 hover:bg-blue-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    title="Copy to clipboard"
                                 >
                                    {copiedItem === `followup-${idx}` ? (
                                       <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                       <Copy className="w-4 h-4 text-blue-600" />
                                    )}
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {/* Version History */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                  Version History ({prompt.versions.length})
               </h3>

               {[...prompt.versions].reverse().map((version, idx) => (
                  <div
                     key={version.version}
                     className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden"
                  >
                     <button
                        onClick={() => toggleVersionExpand(version.version)}
                        className="w-full p-4 flex justify-between items-center hover:bg-slate-100 transition-colors"
                     >
                        <div className="flex items-center gap-3">
                           {expandedVersions[version.version] ? (
                              <ChevronDown className="w-4 h-4 text-slate-600" />
                           ) : (
                              <ChevronRight className="w-4 h-4 text-slate-600" />
                           )}
                           <span className="font-medium text-slate-900">
                              Version {version.version}
                           </span>
                           {idx === 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs border border-green-200">
                                 Current
                              </span>
                           )}
                        </div>
                        <span className="text-sm text-slate-600">
                           {formatDate(version.createdAt)}
                        </span>
                     </button>

                     {expandedVersions[version.version] && (
                        <div className="p-4 border-t border-slate-200 bg-white">
                           <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                              {version.content}
                           </pre>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      );
   };

   return (
      <div className="lg:col-span-2" data-testid="prompt-form">
         {isEditing || !prompt ? editForm() : viewForm(prompt)}
      </div>
   );
};
