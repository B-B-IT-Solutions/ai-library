import { map } from "es-toolkit/compat";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import {
   AddToFavoriteButton,
   PromptMoreOptionsButton,
   UseTemplateButton,
} from "../../buttons";
import { viewPromptUrl } from "../../utils";

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

   const categories = () => {
      return (
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
   };

   return (
      <Card
         ref={ref}
         className="group relative flex flex-col gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
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
               <h4 className="line-clamp-2 cursor-pointer text-lg font-semibold leading-tight text-slate-900 transition-colors hover:text-blue-700">
                  {prompt.title}
               </h4>
            </Link>
         </CardHeader>

         <CardContent className="flex-1 px-5 pb-3 pt-0">
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
               {prompt.description}
            </p>
         </CardContent>

         <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
            <span
               className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
               title="Empfohlenes KI-Modell"
            >
               {prompt.recommendedModel}
            </span>
            <div className="flex items-center gap-2">
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
