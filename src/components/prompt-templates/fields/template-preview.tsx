"use client";

import { CopyButton } from "@/components/shared/buttons";
import { MDRenderer } from "@/components/shared/md";
import {
   DPromptTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

type Props = {
   template: DPromptTemplate;
   values: DPromptTemplateFieldValues;
   resolvedContent: string;
};

export const TemplatePreview = ({
   template,
   values,
   resolvedContent,
}: Props) => {
   return (
      <div className="flex flex-col gap-2" data-testid="template-preview">
         <div className="group relative max-h-[65vh] flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4">
            <CopyButton
               content={resolvedContent}
               size="icon-sm"
               className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
               iconClassName="h-3.5 w-3.5"
            />
            <div
               className="leading-relaxed text-slate-700"
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
