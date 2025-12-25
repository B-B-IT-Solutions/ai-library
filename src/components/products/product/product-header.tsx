import { FC } from "react";
import { Package } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DProduct } from "@/data/types/domain/product";
import { getTypeBadgeColor } from "../utils";

interface ProductPageProps {
   product: DProduct;
}

export const ProductHeader: FC<ProductPageProps> = ({ product }) => {
   const getQuickStats = () => {
      if (product.type === "BUNDLE" && product.bundleItems) {
         return `${product.bundleItems.length} templates included`;
      }
      return null;
   };

   return (
      <div data-testid="product-header">
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
               <h1 className="text-3xl font-bold mb-3" data-testid="name">
                  {product.name}
               </h1>
               <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                     className={getTypeBadgeColor(product.type)}
                     data-testid="badge"
                  >
                     {product.type}
                  </Badge>
                  <span
                     className="text-3xl font-bold text-indigo-600"
                     data-testid="price"
                  >
                     ${product.price}
                  </span>
                  {getQuickStats() && (
                     <span
                        className="text-sm text-slate-600 flex items-center gap-1"
                        data-testid="quick-stats"
                     >
                        <Package className="h-4 w-4" />
                        {getQuickStats()}
                     </span>
                  )}
               </div>
            </div>
         </div>
         <p className="text-base mt-4 text-slate-700" data-testid="description">
            {product.description}
         </p>
      </div>
   );
};
