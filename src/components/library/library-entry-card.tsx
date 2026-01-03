"use client";

import { FC } from "react";
import { map } from "es-toolkit/compat";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DLibraryEntry } from "@/data/types/domain/library";

type LibraryEntryCardProps = {
   entry: DLibraryEntry;
};

export const LibraryEntryCard: FC<LibraryEntryCardProps> = ({ entry }) => {
   const { template } = entry;

   const categories = () => {
      return (
         <div className="flex flex-wrap gap-1 mb-2" data-testid="categories">
            {map(template.categories, (cat) => (
               <span
                  key={cat.name}
                  className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
               >
                  {cat.name}
               </span>
            ))}
         </div>
      );
   };

   return (
      <Card
         className="p-4 gap-0 bg-white border border-slate-300 rounded-lg"
         data-testid="purchased-template-card"
      >
         <CardHeader className="p-0 gap-2 mb-3">
            <h4 className="font-medium text-slate-900">{template.title}</h4>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200 self-start">
               🤖 {template.recommendedModel}
            </span>
         </CardHeader>
         <CardContent className="p-0 grid gap-3">
            {categories()}
            <p className="text-sm text-slate-600 line-clamp-3">
               {template.description}
            </p>

            <div className="flex gap-2 mt-2">
               <Link href={`/library/${template.id}`} className="flex-1">
                  <Button
                     variant="default"
                     size="sm"
                     className="w-full cursor-pointer"
                     data-testid="view-details-button"
                  >
                     Details anzeigen
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </Link>
            </div>
         </CardContent>
      </Card>
   );
};
