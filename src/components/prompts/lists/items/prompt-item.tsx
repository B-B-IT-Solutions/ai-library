"use client";

import { map } from "es-toolkit/compat";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

type Props = {
   prompt: DPromptDescriptor;
};

export const PromptItem = ({ prompt }: Props) => {
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
         className="group relative gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
         data-testid="prompt-list-item"
      >
         <CardHeader className="gap-3 border-b border-slate-200 p-5 pb-3">
            <Link
               href={`/prompts/${prompt.id}`}
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

         <CardContent className="grid gap-3 p-5">{categories()}</CardContent>
      </Card>
   );
};
