import { isEmpty, map } from "es-toolkit/compat";

import { DCollection } from "@/data/types/domain/collection";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { TemplateItemCard } from "./items";

type Props = {
   descriptors: DPromptTemplateDescriptor[];
   collections: DCollection[];
   ref?: React.Ref<HTMLDivElement>;
};

export const TemplateItemsGrid = ({ descriptors, collections, ref }: Props) => {
   if (isEmpty(descriptors)) {
      return (
         <div
            ref={ref}
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

   return (
      <div
         ref={ref}
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="template-items-grid"
      >
         {map(descriptors, (entry) => (
            <TemplateItemCard
               key={entry.id}
               descriptor={entry}
               collections={collections}
            />
         ))}
      </div>
   );
};
