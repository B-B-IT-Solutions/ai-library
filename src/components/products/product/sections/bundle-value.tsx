import { FC } from "react";
import { isEmpty } from "es-toolkit/compat";
import { BadgePercent, Package, TrendingDown } from "lucide-react";

import { DProduct } from "@/data/types/domain/product";

interface BundleValueProps {
   product: DProduct;
}

export const BundleValueSection: FC<BundleValueProps> = ({ product }) => {
   if (!product.savingsAmount) {
      return null;
   }

   const percentage = product.savingsPercentage
      ? product.savingsPercentage
      : Math.floor(product.savingsAmount / product.price);

   const savings = () => {
      return (
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full">
            <TrendingDown className="h-5 w-5 text-green-700" />
            <span className="text-lg font-bold text-green-800">
               Save CHF {product.savingsAmount} ({percentage}%)
            </span>
         </div>
      );
   };

   const totalIndividualPrice = () => {
      if (!isEmpty(product.bundleItems) && product.totalIndividualPrice) {
         return (
            <p className="text-sm text-green-800">
               Get {product.bundleItems!.length} templates for the price of{" "}
               {Math.floor(
                  (product.price * product.bundleItems!.length) /
                     product.totalIndividualPrice
               )}
               !
            </p>
         );
      }
   };

   return (
      <section className="space-y-3" data-testid="bundle-value">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-green-600" />
            Bundle Value
         </h3>

         <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
               <div className="space-y-2">
                  {savings()}
                  {totalIndividualPrice()}
               </div>

               <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-slate-700">Individual prices:</span>
                     <span className="font-medium text-slate-900 line-through">
                        CHF {product.totalIndividualPrice}
                     </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-slate-700">Bundle price:</span>
                     <span className="font-bold text-green-700 text-lg">
                        CHF {product.price}
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
