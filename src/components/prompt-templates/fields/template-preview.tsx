"use client";

import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import { components } from "@/components/shared/md/react-md/components";
import {
   DPromptTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HastNode = any;

function rehypePlaceholders(values: DPromptTemplateFieldValues) {
   return (tree: HastNode) => {
      visit(
         tree,
         "text",
         (node: HastNode, index: number | undefined, parent: HastNode) => {
            if (index === undefined || !parent) return;

            const text: string = node.value;
            const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

            if (!regex.test(text)) return;
            regex.lastIndex = 0;

            const newNodes: HastNode[] = [];
            let lastIndex = 0;

            for (const match of text.matchAll(regex)) {
               if (match.index! > lastIndex) {
                  newNodes.push({
                     type: "text",
                     value: text.slice(lastIndex, match.index!),
                  });
               }

               const name = match[1].trim();
               const raw = values[name];
               const value =
                  raw !== undefined && raw !== null && raw !== ""
                     ? String(raw)
                     : null;

               newNodes.push({
                  type: "element",
                  tagName: "span",
                  properties: {
                     className: value
                        ? "rounded bg-green-100 px-0.5 font-medium text-green-800"
                        : "rounded bg-orange-100 px-0.5 italic text-orange-700",
                  },
                  children: [{ type: "text", value: value ?? `{{${name}}}` }],
               });

               lastIndex = match.index! + match[0].length;
            }

            if (lastIndex < text.length) {
               newNodes.push({
                  type: "text",
                  value: text.slice(lastIndex),
               });
            }

            parent.children.splice(index, 1, ...newNodes);
            return index + newNodes.length;
         }
      );
   };
}

type Props = {
   template: DPromptTemplate;
   values: DPromptTemplateFieldValues;
};

export const TemplatePreview: FC<Props> = ({ template, values }) => {
   return (
      <div
         className="leading-relaxed text-slate-700"
         data-testid="template-preview"
      >
         <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[() => rehypePlaceholders(values)]}
         >
            {template.content}
         </ReactMarkdown>
      </div>
   );
};
