import { isEmpty, map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { TemplateItemCard } from "./items";

type Props = {
   descriptors: DPrompt[];
   collections: DCollection[];
   collectionId?: string;
   ref?: React.Ref<HTMLDivElement>;
};

export const TemplateItemsList = ({
   descriptors,
   collections,
   collectionId,
   ref,
}: Props) => {
   if (isEmpty(descriptors)) {
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="template-items-empty"
         >
            <p className="text-lg font-medium text-slate-600">
               Keine Vorlagen gefunden
            </p>
            <p className="mt-2 text-sm text-slate-500">
               Versuchen Sie, Ihre Filterkriterien anzupassen
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
