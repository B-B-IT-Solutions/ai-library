import { Braces } from "lucide-react";

import { CreatePromptButton } from "../../buttons";

type Props = {
   hasActiveFilters: boolean;
};

export const PromtpsEmpty = ({ hasActiveFilters }: Props) => {
   if (hasActiveFilters) {
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="prompts-filter-empty"
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
         className="flex flex-col items-center justify-center gap-4 py-16 text-center"
         data-testid="prompts-empty"
      >
         <Braces className="h-12 w-12 text-slate-300" />
         <h2 className="text-lg font-semibold text-slate-700">
            Noch keine Prompts
         </h2>
         <p className="max-w-sm text-sm text-muted-foreground">
            Erstelle deinen ersten Prompt und baue deine persönliche Bibliothek
            auf.
         </p>
         <CreatePromptButton size="sm" />
      </div>
   );
};
