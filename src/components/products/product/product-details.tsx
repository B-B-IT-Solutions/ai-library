import { FC } from "react";

import { Separator } from "@/components/shadcn/separator";
import { DProduct } from "@/data/types/domain/product";

import { BundleItems } from "./sections/bundle-items";
import { BundleValue } from "./sections/bundle-value";
import { KeyFeatures } from "./sections/key-features";
import { UsageInstructions } from "./sections/usage-instructions";
import { UseCases } from "./sections/use-cases";

interface ProductDetailsProps {
   product: DProduct;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
   const tempalteDetails = () => {
      if (product.type === "TEMPLATE") {
         return (
            <div className="space-y-6" data-testid="template-details">
               <KeyFeatures product={product} />
               <Separator />
               <UseCases product={product} />
               <Separator />
               {/* <TemplatePreview content={product.template.content} /> */}
               <Separator />
               <UsageInstructions product={product} />
            </div>
         );
      }
   };

   const bundleDetails = () => {
      if (product.type === "BUNDLE") {
         return (
            <div className="space-y-6" data-testid="bundle-details">
               <BundleValue product={product} />
               <Separator />
               <UseCases product={product} />
               <Separator />
               <BundleItems items={product.productItems} groupByCategory />
               <Separator />
               <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-indigo-900 mb-2">
                     Was Sie erhalten
                  </h4>
                  <ul className="space-y-1 text-sm text-indigo-800">
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>
                           {product.productItems.length} professionell gestaltete
                           Prompt-Vorlagen
                        </span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>
                           Optimiert für mehrere KI-Modelle und Anwendungsfälle
                        </span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>Sofortiger Zugriff</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>
                           Sofort einsatzbereite Vorlagen mit klaren Anweisungen
                        </span>
                     </li>
                  </ul>
               </div>
            </div>
         );
      }
   };

   return (
      <div data-testid="product-details">
         {tempalteDetails()}
         {bundleDetails()}
      </div>
   );
};
