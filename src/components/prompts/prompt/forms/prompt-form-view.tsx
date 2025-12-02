"use client";

import { FC, useState } from "react";
import { map } from "es-toolkit/compat";
import {
   Check,
   ChevronDown,
   ChevronRight,
   Copy,
   Edit2,
   Tag,
} from "lucide-react";

import { DPrompt } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

type PromptFomProps = {
   prompt: DPrompt;
};

export const PromptFomView: FC<PromptFomProps> = ({ prompt }) => {
   const [expandedVersions, setExpandedVersions] = useState({});

   const [conentExpanded, setContentExpanded] = useState(false);
   const [followUpsExpanded, setFollowupsExpaned] = useState(false);
   const [copiedItem, setCopiedItem] = useState<string | null>(null);

   const copyToClipboard = async (text: string, itemId: string) => {
      try {
         await navigator.clipboard.writeText(text);
         setCopiedItem(itemId);
         setTimeout(() => setCopiedItem(null), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   const toggleVersionExpand = (promptId: string) => {
      setExpandedVersions((prev) => ({
         ...prev,
         [promptId]: !prev[promptId],
      }));
   };

   const viewForm = () => {
      return (
         <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900">
                     {prompt.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                     {map(prompt.categories, (cat, idx) => (
                        <span
                           key={idx}
                           className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                        >
                           <Tag className="w-3 h-3" />
                           {cat.name}
                        </span>
                     ))}
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                     <div>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDateTime(prompt.createdAt).dateTime}
                     </div>
                     <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDateTime(prompt.updatedAt).dateTime}
                     </div>
                     <div>
                        <span className="font-medium">Current Version:</span> v
                        {prompt.currentVersion}
                     </div>
                     {prompt.recommendedModel && (
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-blue-700 font-medium">
                              🤖 Recommended Model:
                           </span>
                           <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                              {prompt.recommendedModel}
                           </span>
                        </div>
                     )}
                  </div>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
               </button>
            </div>

            {/* Current Prompt Content - Foldable */}
            <div className="mb-6">
               <div
                  onClick={() => setContentExpanded(!conentExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
               >
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                     Current Prompt Content
                  </span>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           copyToClipboard(prompt.content, "current-prompt");
                        }}
                        className="p-2 hover:bg-slate-200 rounded transition-colors"
                        title="Copy to clipboard"
                     >
                        {copiedItem === "current-prompt" ? (
                           <Check className="w-4 h-4 text-green-600" />
                        ) : (
                           <Copy className="w-4 h-4 text-slate-600" />
                        )}
                     </button>
                     {conentExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                     ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                     )}
                  </div>
               </div>

               {conentExpanded && (
                  <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg">
                     <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                        {prompt.content}
                     </pre>
                  </div>
               )}
            </div>

            {/* Follow-up Prompts Section */}
            {prompt.followUpPrompts && prompt.followUpPrompts.length > 0 && (
               <div className="mb-6">
                  <button
                     onClick={() => setFollowupsExpaned(!followUpsExpanded)}
                     className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                     <span className="font-semibold text-slate-900 flex items-center gap-2">
                        Follow-up Prompts ({prompt.followUpPrompts.length})
                     </span>
                     {followUpsExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                     ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                     )}
                  </button>

                  {followUpsExpanded && (
                     <div className="mt-2 space-y-2">
                        {prompt.followUpPrompts.map((followUp, idx) => (
                           <div
                              key={idx}
                              className="p-3 bg-blue-50 border border-blue-200 rounded-lg group"
                           >
                              <div className="flex items-start gap-2">
                                 <span className="text-blue-600 font-medium text-sm mt-0.5">
                                    {idx + 1}.
                                 </span>
                                 <p className="text-sm text-slate-700 flex-1">
                                    {followUp}
                                 </p>
                                 <button
                                    onClick={() =>
                                       copyToClipboard(
                                          followUp,
                                          `followup-${idx}`
                                       )
                                    }
                                    className="p-1.5 hover:bg-blue-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    title="Copy to clipboard"
                                 >
                                    {copiedItem === `followup-${idx}` ? (
                                       <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                       <Copy className="w-4 h-4 text-blue-600" />
                                    )}
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {/* Version History */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                  Version History ({prompt.versions.length})
               </h3>

               {[...prompt.versions].reverse().map((version, idx) => (
                  <div
                     key={version.version}
                     className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden"
                  >
                     <button
                        onClick={() => toggleVersionExpand(version.version)}
                        className="w-full p-4 flex justify-between items-center hover:bg-slate-100 transition-colors"
                     >
                        <div className="flex items-center gap-3">
                           {expandedVersions[version.version] ? (
                              <ChevronDown className="w-4 h-4 text-slate-600" />
                           ) : (
                              <ChevronRight className="w-4 h-4 text-slate-600" />
                           )}
                           <span className="font-medium text-slate-900">
                              Version {version.version}
                           </span>
                           {idx === 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs border border-green-200">
                                 Current
                              </span>
                           )}
                        </div>
                        <span className="text-sm text-slate-600">
                           {formatDateTime(version.createdAt).dateTime}
                        </span>
                     </button>

                     {expandedVersions[version.version] && (
                        <div className="p-4 border-t border-slate-200 bg-white">
                           <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                              {version.content}
                           </pre>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      );
   };

   return (
      <div className="lg:col-span-2" data-testid="prompt-form-view">
         {viewForm()}
      </div>
   );
};
