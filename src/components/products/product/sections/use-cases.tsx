import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { Target } from "lucide-react";

import { DProduct } from "@/data/types/domain/product";

interface UseCasesProps {
   product: DProduct;
}

export const UseCases: FC<UseCasesProps> = ({ product }) => {
   const { useCases } = product;

   if (isEmpty(useCases)) {
      return null;
   }

   return (
      <section className="space-y-3" data-testid="use-cases">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Use Cases
         </h3>
         <div className="flex flex-wrap gap-2">
            {map(useCases, (useCase, index) => (
               <div
                  key={index}
                  className="inline-flex flex-col gap-1 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2"
                  data-testid="use-case"
               >
                  <span
                     className="font-medium text-sm text-indigo-900"
                     data-testid="category"
                  >
                     {useCase.category}
                  </span>
                  <span
                     className="text-xs text-indigo-700"
                     data-testid="description"
                  >
                     {useCase.description}
                  </span>
               </div>
            ))}
         </div>
      </section>
   );
};
