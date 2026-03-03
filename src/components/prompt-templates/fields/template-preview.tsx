"use client";

import { MDRenderer } from "@/components/shared/md";
import {
   DPromptTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

type Props = {
   template: DPromptTemplate;
   values: DPromptTemplateFieldValues;
};

export const TemplatePreview = ({ template, values }: Props) => {
   return (
      <div
         className="leading-relaxed text-slate-700"
         data-testid="template-preview"
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
   );
};
