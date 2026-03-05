import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { Sparkles } from "lucide-react";

import { DProduct } from "@/data/types/domain/product";

interface KeyFeaturesProps {
   product: DProduct;
}

export const KeyFeatures: FC<KeyFeaturesProps> = ({ product }) => {
   const { features } = product;

   if (isEmpty(features)) {
      return null;
   }

   return (
      <section className="space-y-3" data-testid="key-features">
         <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Hauptmerkmale
         </h3>
         <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {map(features, (feature, index) => {
               const { icon: Icon } = feature;
               return (
                  <div
                     key={index}
                     className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                     data-testid="feature"
                  >
                     <div className="flex items-start gap-3">
                        <Icon
                           className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600"
                           data-testid="icon"
                        />
                        <div>
                           <h4
                              className="text-sm font-medium text-slate-900"
                              data-testid="title"
                           >
                              {feature.title}
                           </h4>
                           <p
                              className="mt-1 text-xs text-slate-600"
                              data-testid="description"
                           >
                              {feature.description}
                           </p>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </section>
   );
};
