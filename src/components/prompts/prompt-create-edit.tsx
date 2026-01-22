"use client";

import { FC, useState } from "react";

import { TemplateSelector } from "@/components/prompt-templates";
import { PromptEdit } from "@/components/prompts";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

export const PromptCreateEdit: FC = () => {
   const [template, setTemplate] = useState<
      DPromptTemplateDescriptor | undefined
   >();

   const editForm = () => {
      return (
         <div className="space-y-6">
            <TemplateSelector onSelect={setTemplate} />
            <PromptEdit mode="create" />
         </div>
      );
   };

   return <div data-testid="prompt-create-edit">{editForm()}</div>;
};
