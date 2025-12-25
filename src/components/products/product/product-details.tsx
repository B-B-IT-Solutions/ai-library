import { FC } from "react";

import { Separator } from "@/components/shadcn/separator";
import { DProduct } from "@/data/types/domain/product";

import { BundleItems } from "./product-details-dialog/sections/bundle-items";
import { BundleValueSection } from "./product-details-dialog/sections/bundle-value";
import { KeyFeatures } from "./product-details-dialog/sections/key-features";
import { TemplatePreview } from "./product-details-dialog/sections/template-preview";
import { UsageInstructions } from "./product-details-dialog/sections/usage-instructions";
import { UseCases } from "./product-details-dialog/sections/use-cases";
import type { BundleValue } from "./product-details-dialog/types";
import { parseProductContent } from "./product-details-dialog/utils/content-parser";

interface ProductDetailsProps {
   product: DProduct;
   bundleValue?: BundleValue | null;
}

export const ProductDetails: FC<ProductDetailsProps> = ({
   product,
   bundleValue,
}) => {
   const parsedContent =
      product.type === "TEMPLATE" && product.template
         ? parseProductContent(
              product.template.content,
              product.template.categories.map((c) => c.name)
           )
         : product.type === "BUNDLE" && product.bundleItems
         ? parseProductContent(
              product.bundleItems
                 .map((item) => item.template?.content || "")
                 .join("\n\n"),
              Array.from(
                 new Set(
                    product.bundleItems.flatMap(
                       (item) =>
                          item.template?.categories.map((c) => c.name) || []
                    )
                 )
              )
           )
         : {
              features: [],
              useCases: [],
              examples: [],
              instructions: [],
              placeholders: [],
           };

   return (
      <div className="space-y-6" data-testid="product-details">
         {/* Template Sections */}
         {product.type === "TEMPLATE" && product.template && (
            <>
               <KeyFeatures features={parsedContent.features} />

               <Separator />

               <UseCases useCases={parsedContent.useCases} />

               <Separator />

               <TemplatePreview content={product.template.content} />

               <Separator />

               <UsageInstructions instructions={parsedContent.instructions} />
            </>
         )}

         {/* Bundle Sections */}
         {product.type === "BUNDLE" && product.bundleItems && (
            <>
               {bundleValue && (
                  <>
                     <BundleValueSection value={bundleValue} />
                     <Separator />
                  </>
               )}

               <UseCases useCases={parsedContent.useCases} />

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
         )}
      </div>
   );
};
