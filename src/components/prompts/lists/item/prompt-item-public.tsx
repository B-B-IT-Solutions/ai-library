import { map } from "es-toolkit/compat";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DPrompt } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";
import {
   PublicPromptMoreOptionsButton,
   PublicUsePromptButton,
} from "../../buttons";

type Props = {
   prompt: DPrompt;
   collectionToken?: string | null;
   ref?: React.Ref<HTMLDivElement>;
};

export const PublicPromptItem = ({ prompt, collectionToken, ref }: Props) => {
   const templateDetailsUrl = collectionToken
      ? `/preview/prompts/${prompt.id}?col=${collectionToken}`
      : `/preview/prompts/${prompt.id}`;

   const categories = () => (
      <div className="flex flex-wrap gap-1" data-testid="categories">
         {map(prompt.categories, (cat) => (
            <span
               key={cat.name}
               className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
            >
               {cat.name}
            </span>
         ))}
      </div>
   );

   return (
      <Card
         ref={ref}
         className="group relative flex flex-col gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
         data-testid="prompt-item-public"
      >
         <CardHeader className="gap-2 p-5 pb-3">
            <div className="flex items-start justify-between gap-2">
               {categories()}
            </div>
            <Link
               href={templateDetailsUrl}
               className="group/title"
               data-testid="view-details-link-title"
            >
               <h4 className="line-clamp-2 cursor-pointer text-lg leading-tight font-semibold text-slate-900 transition-colors hover:text-blue-700">
                  {prompt.title}
               </h4>
            </Link>
         </CardHeader>

         <CardContent className="flex-1 px-5 pt-0 pb-3">
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
               {prompt.description}
            </p>
         </CardContent>

         <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
            <span
               className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
               title="Empfohlenes KI-Modell"
            >
               {prompt.model}
            </span>
            <div
               className={cn(
                  "flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 has-[button:disabled]:opacity-100 has-[button[data-state=open]]:opacity-100"
               )}
            >
               <PublicUsePromptButton prompt={prompt} />
               <PublicPromptMoreOptionsButton
                  prompt={prompt}
                  collectionToken={collectionToken}
               />
            </div>
         </div>
      </Card>
   );
};
