import { FC } from "react";
import { Package } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import {
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { DProduct } from "@/data/types/domain/product";
import { getTypeBadgeColor } from "../../utils";

interface ProductHeaderProps {
   product: DProduct;
}

export const ProductHeader: FC<ProductHeaderProps> = ({ product }) => {
   const getQuickStats = () => {
      if (product.type === "BUNDLE" && product.productItems) {
         return `${product.productItems.length} templates included`;
      }
      return null;
   };

   return (
      <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
               <DialogTitle className="text-2xl mb-2">
                  {product.name}
               </DialogTitle>
               <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={getTypeBadgeColor(product.type)}>
                     {product.type}
                  </Badge>
                  <span className="text-2xl font-bold text-indigo-600">
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
         <DialogDescription className="text-base mt-3 text-slate-700">
            {product.description}
         </DialogDescription>
      </DialogHeader>
   );
};
