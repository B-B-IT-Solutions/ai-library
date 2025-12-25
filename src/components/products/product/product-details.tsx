import { FC } from "react";

import { Separator } from "@/components/shadcn/separator";
import { DProduct } from "@/data/types/domain/product";

import type { BundleValue } from "./product-details-dialog/types";
import { BundleItems } from "./sections/bundle-items";
import { BundleValueSection } from "./sections/bundle-value";
import { KeyFeatures } from "./sections/key-features";
import { TemplatePreview } from "./sections/template-preview";
import { UsageInstructions } from "./sections/usage-instructions";
import { UseCases } from "./sections/use-cases";

interface ProductDetailsProps {
   product: DProduct;
   bundleValue?: BundleValue | null;
}

export const ProductDetails: FC<ProductDetailsProps> = ({
   product,
   bundleValue,
}) => {
   // Use structured data directly from product
   const features = product.features || [];
   const useCases = product.useCases || [];
   const instructions = product.instructions || [];

   const tempalteDetails = () => {
      if (product.type === "TEMPLATE" && product.template) {
         return (
            <>
               <KeyFeatures features={features} />

               <Separator />

               <UseCases useCases={useCases} />

               <Separator />

               <TemplatePreview content={product.template.content} />

               <Separator />

               <UsageInstructions instructions={instructions} />
            </>
         );
      }
   };

   const bundleDetails = () => {
      if (product.type === "BUNDLE" && product.bundleItems) {
         return (
            <>
               {bundleValue && (
                  <>
                     <BundleValueSection value={bundleValue} />
                     <Separator />
                  </>
               )}

               <UseCases useCases={useCases} />

               <Separator />

               <BundleItems items={product.bundleItems} groupByCategory />

               <Separator />

               <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-indigo-900 mb-2">
                     What You'll Get
                  </h4>
                  <ul className="space-y-1 text-sm text-indigo-800">
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>
                           {product.bundleItems.length} professionally crafted
                           prompt templates
                        </span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>
                           Optimized for multiple AI models and use cases
                        </span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>Immediate access and lifetime updates</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="shrink-0">✓</span>
                        <span>
                           Ready-to-use templates with clear instructions
                        </span>
                     </li>
                  </ul>
               </div>
            </>
         );
      }
   };

   return (
      <div className="space-y-6" data-testid="product-details">
         {tempalteDetails()}
         {bundleDetails()}
      </div>
   );
};
