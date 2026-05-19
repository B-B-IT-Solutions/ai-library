"use client";

import { CopyButton } from "@/components/shared/buttons";
import { MDRenderer } from "@/components/shared/md";
import {
   DPromptFieldValues,
   DPromptWithContent,
} from "@/data/types/domain/prompt";

type Props = {
   template: DPromptWithContent;
   values: DPromptFieldValues;
   resolvedContent: string;
};

export const TemplatePreview = ({
   template,
   values,
   resolvedContent,
}: Props) => {
   return (
      <div
         className="flex min-h-0 flex-1 flex-col gap-2"
         data-testid="template-preview"
      >
         <div className="group relative flex-1 overflow-y-auto rounded-md border bg-muted/50 p-4">
            <CopyButton
               content={resolvedContent}
               size="icon-sm"
               className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
               iconClassName="h-3.5 w-3.5"
               data-testid="copy-preview-btn"
            />
            <div
               className="leading-relaxed text-foreground/85"
               data-testid="preview"
            >
               <MDRenderer
                  plugins={[
                     {
                        type: "rehype-placeholders",
                        value: values,
                     },
                  ]}
               >
                  {template.content}
               </MDRenderer>
            </div>
         </div>
         <p className="text-xs text-muted-foreground">
            <span className="mr-1 inline-block rounded bg-orange-100 px-1 text-orange-700 italic">
               {"{{platzhalter}}"}
            </span>
            noch nicht ausgefüllt ·{" "}
            <span className="mr-1 inline-block rounded bg-green-100 px-1 font-medium text-green-800">
               wert
            </span>
            ausgefüllt
         </p>
      </div>
   );
};
