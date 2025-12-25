import { FC } from "react";
import * as Icons from "lucide-react";

import type { Feature } from "../product-details-dialog/types";

interface KeyFeaturesProps {
   features: Feature[];
}

export const KeyFeatures: FC<KeyFeaturesProps> = ({ features }) => {
   if (features.length === 0) {
      return null;
   }

   const getIcon = (iconName: string) => {
      const Icon = Icons[iconName as keyof typeof Icons] || Icons.Lightbulb;
      return Icon;
   };

   return (
      <section className="space-y-3">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Icons.Sparkles className="h-5 w-5 text-indigo-600" />
            Key Features
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => {
               const Icon = getIcon(feature.icon);
               return (
                  <div
                     key={index}
                     className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                  >
                     <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                        <div>
                           <h4 className="font-medium text-slate-900 text-sm">
                              {feature.title}
                           </h4>
                           <p className="text-xs text-slate-600 mt-1">
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
