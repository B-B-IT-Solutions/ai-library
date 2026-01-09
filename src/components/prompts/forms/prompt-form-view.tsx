"use client";

import { FC, useState } from "react";
import { map } from "es-toolkit/compat";
import { Calendar, Check, Clock, Copy, Cpu, Edit2, MoreVertical } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardAction,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Separator } from "@/components/shadcn/separator";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
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
   const [copied, setCopied] = useState(false);

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(prompt.content);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   return (
      <div data-testid="prompt-form-view">
         <Card>
            <CardHeader className="border-b pb-6">
               <div className="space-y-4">
                  <div className="flex items-start gap-3">
                     <CardTitle className="text-3xl font-bold text-slate-900">
                        {prompt.title}
                     </CardTitle>
                     <ToggleFavoriteButton
                        promptId={prompt.id}
                        isFavorite={prompt.isFavorite}
                     />
                  </div>

                  {prompt.categories.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                        {map(prompt.categories, (cat, idx) => (
                           <Badge key={idx} variant="secondary">
                              {cat.name}
                           </Badge>
                        ))}
                     </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                     <div className="flex items-center gap-2">
                        <Cpu className="size-4 text-indigo-600" />
                        <Badge variant="outline">{prompt.recommendedModel}</Badge>
                     </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>{formatDateTime(prompt.createdAt).dateTime}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        <span>{formatDateTime(prompt.updatedAt).dateTime}</span>
                     </div>
                  </div>
               </div>

               <CardAction>
                  <div className="flex items-center gap-2">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={copyToClipboard}
                           >
                              {copied ? (
                                 <Check className="size-4 text-green-600" />
                              ) : (
                                 <Copy className="size-4" />
                              )}
                              {copied ? "Kopiert" : "Kopieren"}
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Prompt in Zwischenablage kopieren</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button asChild size="sm">
                              <Link href={`/prompts/${prompt.id}/edit`}>
                                 <Edit2 className="size-4" />
                                 Bearbeiten
                              </Link>
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Prompt bearbeiten</TooltipContent>
                     </Tooltip>
                     <DropdownMenu>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="icon-sm">
                                    <MoreVertical className="size-4" />
                                 </Button>
                              </DropdownMenuTrigger>
                           </TooltipTrigger>
                           <TooltipContent>Weitere Optionen</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                           <DeletePromptButton promptId={prompt.id} />
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </CardAction>
            </CardHeader>

            <CardContent className="space-y-6">
               <PromptContent prompt={prompt} />

               {prompt.followUpPrompts.length > 0 && (
                  <>
                     <Separator />
                     <PromptFollowUps followUps={prompt.followUpPrompts} />
                  </>
               )}

               {prompt.versions && prompt.versions.length > 0 && (
                  <>
                     <Separator />
                     <PromptVersions prompt={prompt} />
                  </>
               )}
            </CardContent>
         </Card>
      </div>
   );
};
