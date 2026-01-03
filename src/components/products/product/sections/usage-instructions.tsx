import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { BookOpen, CheckCircle2 } from "lucide-react";

import { DProduct } from "@/data/types/domain/product";

interface UsageInstructionsProps {
   product: DProduct;
}

export const UsageInstructions: FC<UsageInstructionsProps> = ({ product }) => {
   const { instructions } = product;

   if (isEmpty(instructions)) {
      return null;
   }

   return (
      <section className="space-y-3" data-testid="usage-instructions">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Verwendung
         </h3>

         <div className="space-y-3">
            {map(instructions, (instruction) => (
               <div
                  key={instruction.step}
                  className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg p-4"
                  data-testid="instruction"
               >
                  <div
                     className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm shrink-0"
                     data-testid="step"
                  >
                     {instruction.step}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4
                        className="font-medium text-slate-900 text-sm"
                        data-testid="title"
                     >
                        {instruction.title}
                     </h4>
                     <p
                        className="text-xs text-slate-600 mt-1"
                        data-testid="description"
                     >
                        {instruction.description}
                     </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0" />
               </div>
            ))}
         </div>

         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="flex items-start gap-2">
               <span className="font-semibold shrink-0">💡 Tipp:</span>
               <span>
                  Passen Sie die Vorlage an Ihre spezifischen Bedürfnisse und Ihren Ton an.
                  Die Platzhalter sind Vorschläge - passen Sie sie gerne an!
               </span>
            </p>
         </div>
      </section>
   );
};
