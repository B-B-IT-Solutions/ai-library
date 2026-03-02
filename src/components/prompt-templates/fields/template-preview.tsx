"use client";

import { FC } from "react";

import { MDRenderer } from "@/components/shared/md";
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

function buildPreviewContent(
   content: string,
   values: DPromptTemplateFieldValues
): string {
   return content.replace(
      /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g,
      (_, name: string) => {
         const raw = values[name.trim()];
         const value =
            raw !== undefined && raw !== null && raw !== ""
               ? String(raw)
               : null;
         return value ?? `\`{{${name.trim()}}}\``;
      }
   );
}

type Props = {
   content: string;
   values: DPromptTemplateFieldValues;
};

export const TemplatePreview: FC<Props> = ({ content, values }) => {
   const previewContent = buildPreviewContent(content, values);

   return (
      <MDRenderer data-testid="template-preview">{previewContent}</MDRenderer>
   );
};
