"use client";

import { Control } from "react-hook-form";

import { TabsContent } from "@/components/shadcn/tabs";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { PromptText } from "../sections";

type Props = {
   control: Control<DPromptUpdate>;
};

export const PromptEditorTab = ({ control }: Props) => {
   return (
      <TabsContent value="editor" data-testid="prompt-editor-tab">
         <PromptText control={control} />
      </TabsContent>
   );
};
