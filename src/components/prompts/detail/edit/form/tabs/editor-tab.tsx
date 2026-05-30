"use client";

import { UseFormReturn } from "react-hook-form";

import { TabsContent } from "@/components/shadcn/tabs";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { PromptText } from "../sections";

type Props = {
   tabId: string;
   form: UseFormReturn<DPromptUpdate>;
};

export const PromptEditorTab = ({ tabId, form }: Props) => {
   return (
      <TabsContent value={tabId} data-testid="prompt-editor-tab">
         <PromptText control={form.control} />
      </TabsContent>
   );
};
