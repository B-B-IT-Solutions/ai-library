import { FC } from "react";
import { isEmpty } from "es-toolkit/compat";
import { BadgePercent, Package, TrendingDown } from "lucide-react";

import { DProduct } from "@/data/types/domain/product";

interface BundleValueProps {
   product: DProduct;
}

export const BundleValue: FC<BundleValueProps> = ({ product }) => {
   const { price, discountAmount, productItems } = product;

   if (!discountAmount) {
      return null;
   }

   const originalPrice = price + discountAmount;
   const discountPercentage = Math.floor(
      (discountAmount / originalPrice) * 100
   );

   const savings = () => {
      return (
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full">
            <TrendingDown className="h-5 w-5 text-green-700" />
            <span className="text-lg font-bold text-green-800">
               Sparen Sie CHF {discountAmount} ({discountPercentage}%)
            </span>
         </div>
      );
   };

   const savingsBenefits = () => {
      if (!isEmpty(productItems)) {
         return (
            <p className="text-sm text-green-800">
               Erhalten Sie {productItems!.length} Vorlagen zum Preis von{" "}
               {Math.floor((price * productItems.length) / originalPrice)}!
            </p>
         );
      }
   };

   return (
      <section className="space-y-3" data-testid="bundle-value">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-green-600" />
            Bundle-Wert
         </h3>

         <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
               <div className="space-y-2" data-testid="savings">
                  {savings()}
                  {savingsBenefits()}
               </div>

               <div
                  className="flex flex-col gap-2 text-sm"
                  data-testid="price-summary"
               >
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-slate-700">Einzelpreise:</span>
                     <span className="font-medium text-slate-900 line-through">
                        CHF {originalPrice}
                     </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-slate-700">Bundle-Preis:</span>
                     <span className="font-bold text-green-700 text-lg">
                        CHF {price}
                     </span>
                  </div>
               </div>
            </div>

            <div
               className="mt-4 pt-4 border-t border-green-200"
               data-testid="note"
            >
               <div className="flex items-start gap-2 text-sm text-green-800">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                     <strong>Bundle-Thema:</strong> Diese kuratierte Sammlung
                     bietet alles, was Sie für umfassende KI-gestützte
                     Workflows benötigen. Alle Vorlagen arbeiten nahtlos zusammen für
                     maximale Produktivität.
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
};
