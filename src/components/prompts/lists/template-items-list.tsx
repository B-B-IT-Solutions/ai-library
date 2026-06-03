import { isEmpty, map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { TemplateItemCard } from "./items";

type Props = {
   descriptors: DPrompt[];
   collections: DCollection[];
   collectionId?: string;
   hasActiveFilters?: boolean;
   ref?: React.Ref<HTMLDivElement>;
};

export const TemplateItemsList = ({
   descriptors,
   collections,
   collectionId,
   hasActiveFilters = false,
   ref,
}: Props) => {
   if (isEmpty(descriptors)) {
      if (hasActiveFilters) {
         return (
            <div
               className="flex flex-col items-center justify-center py-16 text-center"
               data-testid="template-items-empty"
            >
               <p className="text-lg font-medium text-slate-700">
                  Keine Ergebnisse für diese Filter
               </p>
               <p className="mt-2 text-sm text-slate-500">
                  Passe deine Filterkriterien an oder setze sie zurück.
               </p>
            </div>
         );
      }
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="template-items-empty"
         >
            <p className="text-lg font-medium text-slate-700">
               Noch keine Prompts
            </p>
            <p className="mt-2 text-sm text-slate-500">
               Erstelle deinen ersten Prompt und baue deine persönliche
               Bibliothek auf.
            </p>
         </div>
      );
   }

   const item = (descriptor: DPrompt, index: number) => {
      const isLast = index === descriptors.length - 1;
      return (
         <TemplateItemCard
            key={descriptor.id}
            prompt={descriptor}
            collections={collections}
            collectionId={collectionId}
            ref={isLast ? ref : undefined}
         />
      );
   };

   return (
      <div className="space-y-4" data-testid="template-items-list">
         {map(descriptors, (d, i) => item(d, i))}
      </div>
   );
};
