import { FC } from "react";
import { Target } from "lucide-react";

import { DUseCase } from "@/data/types/domain/product";

interface UseCasesProps {
   useCases: DUseCase[];
}

export const UseCases: FC<UseCasesProps> = ({ useCases }) => {
   if (useCases.length === 0) {
      return null;
   }

   return (
      <section className="space-y-3">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Use Cases
         </h3>
         <div className="flex flex-wrap gap-2">
            {useCases.map((useCase, index) => (
               <div
                  key={index}
                  className="inline-flex flex-col gap-1 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2"
               >
                  <span className="font-medium text-sm text-indigo-900">
                     {useCase.category}
                  </span>
                  <span className="text-xs text-indigo-700">
                     {useCase.description}
                  </span>
               </div>
            ))}
         </div>
      </section>
   );
};
