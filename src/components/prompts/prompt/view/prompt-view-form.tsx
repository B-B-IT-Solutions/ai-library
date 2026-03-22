import { isEmpty, map } from "es-toolkit/compat";
import { Calendar, Clock, Cpu, MoreVertical } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardAction,
   CardContent,
   CardHeader,
} from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";
import {
   CopyPromptButton,
   DeletePromptButton,
   EditPromptButton,
   ToggleFavoriteButton,
} from "../../buttons";

import { PromptContent } from "./content/prompt-content-view";
import { PromptFollowUps } from "./follow-ups/prompt-follow-ups-view";
import { PromptVersions } from "./versions/prompt-versions";

type Props = {
   prompt: DPromptDescriptor;
};

export const PromptViewForm = ({ prompt }: Props) => {
   const actions = () => {
      return (
         <div className="flex items-center gap-2">
            <EditPromptButton prompt={prompt} />
            <CopyPromptButton prompt={prompt} size="sm" showLabel={true} />
            <DropdownMenu data-testid="actions-context-menu">
               <DropdownMenuTrigger asChild={true}>
                  <Button
                     variant="outline"
                     size="icon-sm"
                     className="cursor-pointer"
                  >
                     <MoreVertical className="size-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DeletePromptButton prompt={prompt} />
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      );
   };

   const categories = () => {
      if (!isEmpty(prompt.categories)) {
         return (
            <div className="flex flex-wrap gap-2">
               {map(prompt.categories, (cat, idx) => (
                  <Badge key={idx} variant="secondary">
                     {cat.name}
                  </Badge>
               ))}
            </div>
         );
      }
   };

   return (
      <Card data-testid="prompt-view-form">
         <CardHeader className="border-b pb-6">
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <ToggleFavoriteButton prompt={prompt} />
               </div>
               {categories()}
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
            <CardAction>{actions()}</CardAction>
         </CardHeader>
         <CardContent className="space-y-6">
            <PromptContent prompt={prompt} />
            <PromptFollowUps prompt={prompt} />
            <PromptVersions prompt={prompt} />
         </CardContent>
      </Card>
   );
};
