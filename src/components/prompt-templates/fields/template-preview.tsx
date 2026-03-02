"use client";

import { FC } from "react";

import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

type Segment =
   | { type: "text"; content: string }
   | { type: "placeholder"; name: string; value: string | null };

function parseTemplate(
   content: string,
   values: DPromptTemplateFieldValues
): Segment[] {
   const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
   const segments: Segment[] = [];
   let lastIndex = 0;

   for (const match of content.matchAll(regex)) {
      if (match.index > lastIndex) {
         segments.push({
            type: "text",
            content: content.slice(lastIndex, match.index),
         });
      }

      const name = match[1].trim();
      const raw = values[name];
      const value =
         raw !== undefined && raw !== null && raw !== "" ? String(raw) : null;

      segments.push({ type: "placeholder", name, value });
      lastIndex = match.index + match[0].length;
   }

   if (lastIndex < content.length) {
      segments.push({ type: "text", content: content.slice(lastIndex) });
   }

   return segments;
}

type Props = {
   content: string;
   values: DPromptTemplateFieldValues;
};

export const TemplatePreview: FC<Props> = ({ content, values }) => {
   const segments = parseTemplate(content, values);

   return (
      <div
         className="text-sm leading-relaxed whitespace-pre-wrap"
         data-testid="template-preview"
      >
         {segments.map((segment, i) => {
            if (segment.type === "text") {
               return <span key={i}>{segment.content}</span>;
            }

            if (segment.value) {
               return (
                  <span
                     key={i}
                     className="rounded bg-green-100 px-0.5 font-medium text-green-800 not-italic"
                  >
                     {segment.value}
                  </span>
               );
            }

            return (
               <span
                  key={i}
                  className="rounded bg-orange-100 px-0.5 text-orange-700 italic"
               >
                  {`{{${segment.name}}}`}
               </span>
            );
         })}
      </div>
   );
};
