"use client";

import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";

import { BasicInfo } from "./sections";
import { PromptFormTabs } from "./tabs";

type Props = {
   form: UseFormReturn<DPromptUpdate>;
   globalFields: DGlobalPromptField[];
   isEdit: boolean;
   versionNote: string;
   onVersionNoteChange: (note: string) => void;
   /**
    * Native `<form>` submit handler — i.e. `form.handleSubmit(...)` bound to
    * the "normal" save path. `react-hook-form`/the actual submission and the
    * "save as new version" path both live in `prompt-edit.tsx`, which owns
    * the `form` instance; this component only renders the fields and wires
    * up plain keyboard-driven submission (e.g. Enter in a text input).
    */
   onSubmit: (event?: React.BaseSyntheticEvent) => void;
};

export const PromptEditForm = ({
   form,
   globalFields,
   isEdit,
   versionNote,
   onVersionNoteChange,
   onSubmit,
}: Props) => {
   const [isEditorExpanded, setIsEditorExpanded] = useState(false);

   const toggleExpanded = useCallback(() => {
      setIsEditorExpanded((value) => !value);
   }, []);

   return (
      <div data-testid="prompt-edit-form" className="space-y-4">
         <form
            id="prompt-edit-form"
            onSubmit={onSubmit}
            className="space-y-4"
         >
            {!isEditorExpanded && (
               <div className="rounded-xl bg-white p-6 shadow-sm">
                  <BasicInfo control={form.control} />
               </div>
            )}
            <div className="rounded-xl bg-white p-6 shadow-sm">
               <PromptFormTabs
                  form={form}
                  globalFields={globalFields}
                  isEditorExpanded={isEditorExpanded}
                  onToggleExpand={toggleExpanded}
                  isEdit={isEdit}
                  versionNote={versionNote}
                  onVersionNoteChange={onVersionNoteChange}
               />
            </div>
         </form>
      </div>
   );
};
