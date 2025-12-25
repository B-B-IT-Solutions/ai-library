"use client";

import { FC, useState } from "react";
import { ChevronDown, ChevronUp, Code, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   addLineNumbers,
   createContentSections,
   formatTemplateContent,
   highlightPlaceholdersInLine,
} from "../utils/template-formatter";

interface TemplatePreviewProps {
   content: string;
}

export const TemplatePreview: FC<TemplatePreviewProps> = ({ content }) => {
   const [copied, setCopied] = useState(false);
   const [collapsedSections, setCollapsedSections] = useState<Set<number>>(
      new Set()
   );

   const formattedLines = formatTemplateContent(content);
   const sections = createContentSections(formattedLines);

   const handleCopy = async () => {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const toggleSection = (index: number) => {
      setCollapsedSections((prev) => {
         const next = new Set(prev);
         if (next.has(index)) {
            next.delete(index);
         } else {
            next.add(index);
         }
         return next;
      });
   };

   return (
      <section className="space-y-3">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
               <Code className="h-5 w-5 text-indigo-600" />
               Template Preview
            </h3>
            <Button
               variant="outline"
               size="sm"
               onClick={handleCopy}
               className="gap-2"
            >
               <Copy className="h-4 w-4" />
               {copied ? "Copied!" : "Copy"}
            </Button>
         </div>

         <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            {sections.map((section, sectionIndex) => {
               const isCollapsed = collapsedSections.has(sectionIndex);
               const displayLines = isCollapsed
                  ? section.lines.slice(0, 3)
                  : section.lines;

               return (
                  <div key={sectionIndex} className="border-b last:border-b-0">
                     {section.collapsible && (
                        <button
                           onClick={() => toggleSection(sectionIndex)}
                           className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                           <span className="font-medium text-sm text-slate-700">
                              {section.title}
                           </span>
                           {isCollapsed ? (
                              <ChevronDown className="h-4 w-4 text-slate-600" />
                           ) : (
                              <ChevronUp className="h-4 w-4 text-slate-600" />
                           )}
                        </button>
                     )}

                     <div className="p-4 max-h-96 overflow-y-auto font-mono text-sm">
                        {displayLines.map((line, lineIndex) => (
                           <div
                              key={lineIndex}
                              className="flex items-start py-0.5"
                           >
                              <span
                                 dangerouslySetInnerHTML={{
                                    __html: addLineNumbers(line),
                                 }}
                              />
                              <span
                                 className={line.className}
                                 dangerouslySetInnerHTML={{
                                    __html: highlightPlaceholdersInLine(
                                       line.content
                                    ),
                                 }}
                              />
                           </div>
                        ))}
                        {isCollapsed && section.lines.length > 3 && (
                           <div className="text-slate-500 text-xs mt-2">
                              ... {section.lines.length - 3} more lines
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </section>
   );
};
