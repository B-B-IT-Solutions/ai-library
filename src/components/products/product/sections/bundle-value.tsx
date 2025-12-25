import { FC } from "react";
import { BadgePercent, Package, TrendingDown } from "lucide-react";

import type { BundleValue } from "../product-details-dialog/types";
import {
   formatPercentage,
   formatPrice,
} from "../product-details-dialog/utils/value-calculator";

interface BundleValueProps {
   value: BundleValue | null;
}

export const BundleValueSection: FC<BundleValueProps> = ({ value }) => {
   if (!value || value.savings <= 0) {
      return null;
   }

   return (
      <section className="space-y-3">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-green-600" />
            Bundle Value
         </h3>

         <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full">
                     <TrendingDown className="h-5 w-5 text-green-700" />
                     <span className="text-lg font-bold text-green-800">
                        Save ${formatPrice(value.savings)} (
                        {formatPercentage(value.savingsPercentage)}%)
                     </span>
                  </div>
                  <p className="text-sm text-green-800">
                     Get {value.itemCount} templates for the price of{" "}
                     {Math.floor(
                        (value.itemCount * value.bundlePrice) /
                           value.totalIndividualPrice
                     )}
                     !
                  </p>
               </div>

               <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-slate-700">Individual prices:</span>
                     <span className="font-medium text-slate-900 line-through">
                        ${formatPrice(value.totalIndividualPrice)}
                     </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-slate-700">Bundle price:</span>
                     <span className="font-bold text-green-700 text-lg">
                        ${formatPrice(value.bundlePrice)}
                     </span>
                  </div>
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-green-200">
               <div className="flex items-start gap-2 text-sm text-green-800">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                     <strong>Bundle Theme:</strong> This curated collection
                     provides everything you need for comprehensive AI-assisted
                     workflows. All templates work together seamlessly for
                     maximum productivity.
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
};
