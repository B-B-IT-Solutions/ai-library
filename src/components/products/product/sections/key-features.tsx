import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import * as Icons from "lucide-react";

import { DProduct } from "@/data/types/domain/product";

interface KeyFeaturesProps {
   product: DProduct;
}

export const KeyFeatures: FC<KeyFeaturesProps> = ({ product }) => {
   const { features } = product;

   if (isEmpty(features)) {
      return null;
   }

   const getIcon = (iconName: string) => {
      const Icon = Icons[iconName as keyof typeof Icons] || Icons.Lightbulb;
      return Icon;
   };

   return (
      <section className="space-y-3" data-testid="key-features">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Icons.Sparkles className="h-5 w-5 text-indigo-600" />
            Hauptmerkmale
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {map(features, (feature, index) => {
               const Icon = getIcon(feature.icon);
               return (
                  <div
                     key={index}
                     className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                     data-testid="feature"
                  >
                     <div className="flex items-start gap-3">
                        <Icon
                           className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0"
                           data-testid="icon"
                        />
                        <div>
                           <h4
                              className="font-medium text-slate-900 text-sm"
                              data-testid="title"
                           >
                              {feature.title}
                           </h4>
                           <p
                              className="text-xs text-slate-600 mt-1"
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
