import { FC } from "react";
import { Package } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DProduct } from "@/data/types/domain/product";

import { getTypeBadgeColor } from "./utils";

interface ProductPageHeaderProps {
   product: DProduct;
}

export const ProductPageHeader: FC<ProductPageHeaderProps> = ({ product }) => {
   const getQuickStats = () => {
      if (product.type === "BUNDLE" && product.bundleItems) {
         return `${product.bundleItems.length} templates included`;
      }
      return null;
   };

   return (
      <div data-testid="product-page-header">
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
               <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
               <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={getTypeBadgeColor(product.type)}>
                     {product.type}
                  </Badge>
                  <span className="text-3xl font-bold text-indigo-600">
                     ${product.price.toFixed(2)}
                  </span>
                  {getQuickStats() && (
                     <span className="text-sm text-slate-600 flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {getQuickStats()}
                     </span>
                  )}
               </div>
            </div>
         </div>
         <p className="text-base mt-4 text-slate-700">{product.description}</p>
      </div>
   );
};
