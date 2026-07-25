"use client";

import { useMemo } from "react";
import { isEmpty } from "es-toolkit/compat";
import { AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { cn } from "@/lib/utils";
import { extractVariablesFromContent } from "../utils";

import { PromptEditorTab } from "./editor-tab";
import { resolveVariableStatus } from "./utils";
import { PromptVariablesTab } from "./variables-tab";

type Props = {
   form: UseFormReturn<DPromptUpdate>;
   globalFields: DGlobalPromptField[];
   isEditorExpanded: boolean;
   onToggleExpand: () => void;
   isEdit: boolean;
   versionNote: string;
   onVersionNoteChange: (note: string) => void;
};

export const PromptFormTabs = ({
   form,
   globalFields,
   isEditorExpanded,
   onToggleExpand,
   isEdit,
   versionNote,
   onVersionNoteChange,
}: Props) => {
   const { fields } = useFieldArray({
      control: form.control,
      name: "fields",
   });

   const { errors } = form.formState;
   const hasFieldErrors = !isEmpty(errors?.fields);

   const content = form.watch("content");
   const globalFieldIds = form.watch("globalFieldIds");
   const watchedFields = form.watch("fields");

   const detectedVariables = useMemo(
      () => extractVariablesFromContent(content || ""),
      [content]
   );

   const variableStatus = useMemo(() => {
      return resolveVariableStatus(
         detectedVariables,
         watchedFields,
         globalFields,
         globalFieldIds
      );
   }, [detectedVariables, watchedFields, globalFields, globalFieldIds]);

   const hasNewVariables = variableStatus.undefined.length > 0;

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
                  className={cn(
                     hasFieldErrors ? "text-red-600 hover:text-red-600" : ""
                  )}
                  data-testid="variables-tab-trigger"
               >
                  Platzhalter
                  {hasFieldErrors ? (
                     <AlertCircle
                        className="ml-1.5 h-3.5 w-3.5 text-red-500"
                        data-testid="error-alert"
                     />
                  ) : hasNewVariables ? (
                     <span
                        className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700"
                        data-testid="new-variables-badge"
                     >
                        {variableStatus.undefined.length}
                     </span>
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
         <PromptEditorTab
            tabId={editorTabId}
            form={form}
            isEdit={isEdit}
            versionNote={versionNote}
            onVersionNoteChange={onVersionNoteChange}
         />
         <PromptVariablesTab
            tabId={variablesTabId}
            form={form}
            globalFields={globalFields}
            detectedVariables={detectedVariables}
            variableStatus={variableStatus}
         />
      </Tabs>
   );
};
