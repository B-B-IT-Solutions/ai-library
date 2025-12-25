import { FC } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

import { DInstruction } from "@/data/types/domain/product";

interface UsageInstructionsProps {
   instructions: DInstruction[];
}

export const UsageInstructions: FC<UsageInstructionsProps> = ({
   instructions,
}) => {
   if (instructions.length === 0) {
      return null;
   }

   return (
      <section className="space-y-3">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            How to Use
         </h3>

         <div className="space-y-3">
            {instructions.map((instruction) => (
               <div
                  key={instruction.step}
                  className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg p-4"
               >
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm shrink-0">
                     {instruction.step}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="font-medium text-slate-900 text-sm">
                        {instruction.title}
                     </h4>
                     {instruction.description && (
                        <p className="text-xs text-slate-600 mt-1">
                           {instruction.description}
                        </p>
                     )}
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0" />
               </div>
            ))}
         </div>

         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="flex items-start gap-2">
               <span className="font-semibold shrink-0">💡 Tip:</span>
               <span>
                  Customize the template to match your specific needs and tone.
                  The placeholders are suggestions - feel free to adapt them!
               </span>
            </p>
         </div>
      </section>
   );
};
