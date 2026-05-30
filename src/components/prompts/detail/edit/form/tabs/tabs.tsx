"use client";

import { isEmpty } from "es-toolkit/compat";
import { AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { cn } from "@/lib/utils";

import { PromptEditorTab } from "./editor-tab";
import { PromptVariablesTab } from "./variables-tab";

type Props = {
   form: UseFormReturn<DPromptUpdate>;
   globalFields: DGlobalPromptField[];
   isEditorExpanded: boolean;
   onToggleExpand: () => void;
};

export const PromptFormTabs = ({
   form,
   globalFields,
   isEditorExpanded,
   onToggleExpand,
}: Props) => {
   const { fields } = useFieldArray({
      control: form.control,
      name: "fields",
   });

   const { errors } = form.formState;
   const hasFieldErrors = !isEmpty(errors?.fields);

   const editorTabId = "editor-tab";
   const variablesTabId = "variables-tab";

   return (
      <Tabs defaultValue={editorTabId} data-testid="prompt-form-tabs">
         <div className="mb-2 flex items-center justify-between">
            <TabsList>
               <TabsTrigger
                  value={editorTabId}
                  data-testid="editor-tab-trigger"
               >
                  Prompt
               </TabsTrigger>
               <TabsTrigger
                  value={variablesTabId}
                  data-testid="variables-tab-trigger"
                  className={cn(
                     hasFieldErrors ? "text-red-600 hover:text-red-600" : ""
                  )}
               >
                  Platzhalter
                  {hasFieldErrors ? (
                     <AlertCircle className="ml-1.5 h-3.5 w-3.5 text-red-500" />
                  ) : (
                     fields.length > 0 && (
                        <span className="ml-1.5 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
                           {fields.length}
                        </span>
                     )
                  )}
               </TabsTrigger>
            </TabsList>
            <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={onToggleExpand}
               className="cursor-pointer text-slate-500 hover:text-slate-900"
               title={isEditorExpanded ? "Verkleinern" : "Vergrößern"}
               data-testid="expand-editor-btn"
            >
               {isEditorExpanded ? (
                  <Minimize2 className="h-4 w-4" />
               ) : (
                  <Maximize2 className="h-4 w-4" />
               )}
            </Button>
         </div>
         <PromptEditorTab tabId={editorTabId} control={form.control} />
         <PromptVariablesTab
            tabId={variablesTabId}
            form={form}
            globalFields={globalFields}
         />
      </Tabs>
   );
};
