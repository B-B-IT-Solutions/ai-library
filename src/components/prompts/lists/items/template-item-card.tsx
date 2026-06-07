import { map } from "es-toolkit/compat";
import { Zap } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";
import {
   AddToFavoriteButton,
   PromptMoreOptionsButton,
   UseTemplateButton,
} from "../../buttons";
import { viewPromptUrl } from "../../utils";

const CATEGORY_ACCENT_COLORS: Record<string, string> = {
   Writing: "border-l-violet-500",
   Marketing: "border-l-rose-500",
   Code: "border-l-cyan-500",
   Business: "border-l-amber-500",
   Education: "border-l-green-500",
   Research: "border-l-teal-500",
   Social: "border-l-pink-500",
};

type Props = {
   prompt: DPrompt;
   currentCollection?: DCollectionPreview;
   ref?: React.Ref<HTMLDivElement>;
};

export const TemplateItemCard = ({
   prompt,
   currentCollection,
   ref,
}: Props) => {
   const viewUrl = viewPromptUrl(prompt, currentCollection);
   const accentColor =
      CATEGORY_ACCENT_COLORS[prompt.categories[0]?.name ?? ""] ??
      "border-l-blue-500";

   const categories = () => {
      return (
         <div className="flex flex-wrap gap-1" data-testid="categories">
            {map(prompt.categories, (cat) => (
               <span
                  key={cat.name}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
               >
                  {cat.name}
               </span>
            ))}
         </div>
      );
   };

   return (
      <Card
         ref={ref}
         className={cn(
            "group relative flex flex-col gap-0 rounded-lg border border-l-4 border-slate-200 bg-white p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]",
            accentColor
         )}
         data-testid="template-item-card"
      >
         <CardHeader className="gap-2 p-5 pb-3">
            <div className="flex items-start justify-between gap-2">
               {categories()}
               <AddToFavoriteButton descriptor={prompt} variant="inline" />
            </div>
            <Link
               href={viewUrl}
               className="group/title"
               data-testid="view-details-link-title"
            >
               <h4 className="cursor-pointer text-lg font-semibold leading-tight text-slate-900 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  {prompt.title}
               </h4>
            </Link>
         </CardHeader>

         <CardContent className="flex-1 px-5 pb-4 pt-0">
            <div className="relative">
               <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {prompt.description}
               </p>
               <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent" />
            </div>
         </CardContent>

         <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <span
               className="flex items-center gap-1 text-xs text-slate-500"
               title="Empfohlenes KI-Modell"
            >
               <Zap className="size-3" />
               {prompt.recommendedModel}
            </span>
            <div className="flex items-center gap-1">
               <UseTemplateButton descriptor={prompt} />
               <PromptMoreOptionsButton
                  prompt={prompt}
                  currentCollection={currentCollection}
               />
            </div>
         </div>
      </Card>
   );
};
