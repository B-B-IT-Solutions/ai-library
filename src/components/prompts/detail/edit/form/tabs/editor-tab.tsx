"use client";

import { UseFormReturn } from "react-hook-form";

import { TabsContent } from "@/components/shadcn/tabs";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { PromptText } from "../sections";

type Props = {
   tabId: string;
   form: UseFormReturn<DPromptUpdate>;
   isEdit: boolean;
   versionNote: string;
   onVersionNoteChange: (note: string) => void;
};

export const PromptEditorTab = ({
   tabId,
   form,
   isEdit,
   versionNote,
   onVersionNoteChange,
}: Props) => {
   return (
      <TabsContent value={tabId} data-testid="prompt-editor-tab">
         <PromptText
            control={form.control}
            isEdit={isEdit}
            versionNote={versionNote}
            onVersionNoteChange={onVersionNoteChange}
         />
      </TabsContent>
   );
};
