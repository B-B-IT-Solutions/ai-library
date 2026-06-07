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
         <div className="mb-2 flex flex-wrap gap-1" data-testid="categories">
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
         className="group relative gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
         data-testid="template-item-card"
      >
         <AddToFavoriteButton descriptor={prompt} />
         <CardHeader className="gap-3 border-b border-slate-200 p-5 pb-3">
            <Link
               href={viewUrl}
               className="group/title"
               data-testid="view-details-link-title"
            >
               <h4 className="cursor-pointer text-lg leading-tight font-semibold text-slate-900 transition-colors hover:text-blue-700">
                  {prompt.title}
               </h4>
            </Link>
            <div>
               <span className="self-start rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {prompt.recommendedModel}
               </span>
            </div>
         </CardHeader>

         <CardContent className="grid gap-3 p-5">
            {categories()}

            <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
               {prompt.description}
            </p>

            <div className="flex gap-2 pt-2">
               <UseTemplateButton descriptor={prompt} className="flex-1" />
               <PromptMoreOptionsButton
                  prompt={prompt}
                  currentCollection={currentCollection}
               />
            </div>
         </CardContent>
      </Card>
   );
};
