"use client";

import { FC, ReactNode, useState } from "react";

import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

type Segment =
   | { type: "text"; content: string }
   | { type: "placeholder"; name: string; value: string | null };

const CONTEXT_CHARS = 80;

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

const OmissionMark = ({ hiddenCount }: { hiddenCount: number }) => (
   <span className="mx-0.5 inline-block align-middle select-none rounded border border-dashed border-muted-foreground/40 bg-muted px-2 py-px text-xs text-muted-foreground leading-5">
      ··· {hiddenCount} Zeichen ausgeblendet ···
   </span>
);

function collapseTextSegment(
   text: string,
   prevIsPlaceholder: boolean,
   nextIsPlaceholder: boolean
): ReactNode {
   if (text.length <= CONTEXT_CHARS + 20) return text;

   const half = Math.floor(CONTEXT_CHARS / 2);
   const hiddenCount = text.length - CONTEXT_CHARS;

   if (!prevIsPlaceholder && nextIsPlaceholder) {
      return (
         <>
            <OmissionMark hiddenCount={text.length - CONTEXT_CHARS} />
            {text.slice(-CONTEXT_CHARS)}
         </>
      );
   }

   if (prevIsPlaceholder && !nextIsPlaceholder) {
      return (
         <>
            {text.slice(0, CONTEXT_CHARS)}
            <OmissionMark hiddenCount={text.length - CONTEXT_CHARS} />
         </>
      );
   }

   if (prevIsPlaceholder && nextIsPlaceholder) {
      return (
         <>
            {text.slice(0, half)}
            <OmissionMark hiddenCount={hiddenCount} />
            {text.slice(-half)}
         </>
      );
   }

   // No adjacent placeholders
   return (
      <>
         {text.slice(0, CONTEXT_CHARS)}
         <OmissionMark hiddenCount={text.length - CONTEXT_CHARS} />
      </>
   );
}

type Props = {
   content: string;
   values: DPromptTemplateFieldValues;
};

export const TemplatePreview: FC<Props> = ({ content, values }) => {
   const [showFull, setShowFull] = useState(false);

   const segments = parseTemplate(content, values);
   const hasLongText = segments.some(
      (s) => s.type === "text" && s.content.length > CONTEXT_CHARS + 20
   );

   return (
      <div className="flex flex-col gap-3" data-testid="template-preview">
         <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {segments.map((segment, i) => {
               if (segment.type === "text") {
                  if (showFull) return <span key={i}>{segment.content}</span>;

                  const prevIsPlaceholder =
                     i > 0 && segments[i - 1].type === "placeholder";
                  const nextIsPlaceholder =
                     i < segments.length - 1 &&
                     segments[i + 1].type === "placeholder";

                  return (
                     <span key={i}>
                        {collapseTextSegment(
                           segment.content,
                           prevIsPlaceholder,
                           nextIsPlaceholder
                        )}
                     </span>
                  );
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

         {hasLongText && (
            <button
               type="button"
               onClick={() => setShowFull((v) => !v)}
               className="self-start text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
               {showFull ? "Kompaktansicht" : "Vollständigen Prompt anzeigen"}
            </button>
         )}
      </div>
   );
};
