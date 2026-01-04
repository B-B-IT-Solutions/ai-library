import { FC } from "react";
import { map } from "es-toolkit/compat";
import { Edit2, Tag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

import { DeletePromptButton } from "./delete-prompt-button";
import { PromptContent } from "./prompt-content";
import { PromptFollowUps } from "./prompt-follow-ups";
import { PromptVersions } from "./prompt-versions";
import { ToggleFavoriteButton } from "./toggle-favorite-button";

type PromptFomProps = {
   prompt: DPromptDescriptor;
};

export const PromptFormView: FC<PromptFomProps> = ({ prompt }) => {
   const viewForm = () => {
      return (
         <div className="space-y-6 bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <h2 className="text-2xl font-bold text-slate-900">
                        {prompt.title}
                     </h2>
                     <ToggleFavoriteButton
                        promptId={prompt.id}
                        isFavorite={prompt.isFavorite}
                     />
                  </div>
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
               <div className="flex gap-2">
                  <Button
                     asChild
                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                     <Link href={`/prompts/${prompt.id}/edit`}>
                        <Edit2 className="w-4 h-4" />
                        Edit
                     </Link>
                  </Button>
                  <DeletePromptButton promptId={prompt.id} />
               </div>
            </div>
            <PromptContent prompt={prompt} />
            {prompt.followUpPrompts.length > 0 && (
               <PromptFollowUps followUps={prompt.followUpPrompts} />
            )}
            <PromptVersions prompt={prompt} />
         </div>
      );
   };

   return (
      <div className="lg:col-span-2" data-testid="prompt-form-view">
         {viewForm()}
      </div>
   );
};
