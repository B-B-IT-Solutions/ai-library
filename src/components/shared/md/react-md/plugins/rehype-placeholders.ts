import { visit } from "unist-util-visit";

import { DPromptFieldValues } from "@/data/types/domain/prompt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HastNode = any;

export const rehypePlaceholders = (values: DPromptFieldValues) => {
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
};
