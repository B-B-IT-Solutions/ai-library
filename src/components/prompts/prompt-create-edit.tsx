"use client";

import { FC, useState } from "react";

import { TemplateSelector } from "@/components/prompt-templates";
import { PromptFormEdit } from "@/components/prompts";
import { DPrompt } from "@/data/types/domain/prompt";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type PromptCreateEditProps = {
   prompt?: DPrompt;
};

export const PromptCreateEdit: FC<PromptCreateEditProps> = ({ prompt }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [template, setTemplate] = useState<
      DPromptTemplateDescriptor | undefined
   >();

   const editForm = () => {
      return (
         <div className="space-y-6">
            {/* Template Selector */}
            {!prompt && <TemplateSelector onSelect={setTemplate} />}
            <PromptFormEdit prompt={prompt} />
         </div>
      );
   };

   return <div data-testid="prompt-create-edit">{editForm()}</div>;
};
