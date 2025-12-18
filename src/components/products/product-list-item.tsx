import { FC } from "react";
import { map } from "es-toolkit/compat";

import { Card } from "@/components/shadcn/card";
import { DProduct } from "@/data/types/domain/product";

import { AddToCartButton } from "./add-to-cart-button";
import { ShowDetailsButton } from "./show-details-button";

type ProductListItemProps = {
   product: DProduct;
   isInCart: boolean;
};

export const ProductListItem: FC<ProductListItemProps> = ({
   product,
   isInCart,
}) => {
   const typeBadge = () => {
      const colors = {
         TEMPLATE: "bg-blue-100 text-blue-700 border-blue-200",
         BUNDLE: "bg-green-100 text-green-700 border-green-200",
      };

      return (
         <span
            className={`text-xs px-2 py-0.5 rounded border ${
               colors[product.type]
            }`}
         >
            {product.type}
         </span>
      );
   };

   const categories = () => {
      if (!product.template?.categories) {
         return null;
      }

      return (
         <div className="flex flex-wrap gap-1" data-testid="categories">
            {map(product.template.categories, (cat) => (
               <span
                  key={cat.name}
                  className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
               >
                  {cat.name}
               </span>
            ))}
         </div>
      );
   };

   const bundleInfo = () => {
      if (product.type !== "BUNDLE" || !product.bundleItems) {
         return null;
      }
      return `${product.bundleItems.length} templates included`;
   };

   return (
      <Card
         className="p-4 bg-white border border-slate-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
         data-testid="product-list-item"
      >
         <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Left: Product Info */}
            <div className="flex-1 min-w-0 space-y-2">
               <div className="flex items-start gap-2 flex-wrap">
                  <h4 className="font-medium text-slate-900 text-lg flex-1">
                     {product.name}
                  </h4>
                  {typeBadge()}
               </div>

               <p className="text-sm text-slate-600 line-clamp-2">
                  {product.description}
               </p>

               <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  {categories()}
                  {bundleInfo() && (
                     <span className="flex items-center gap-1">
                        {bundleInfo()}
                     </span>
                  )}
               </div>
            </div>

            {/* Right: Price and Actions */}
            <div className="flex flex-col items-end gap-3 sm:min-w-[200px]">
               <p className="text-2xl font-bold text-slate-900">
                  ${product.price.toFixed(2)}
               </p>

               <div className="flex gap-2 w-full sm:w-auto">
                  <ShowDetailsButton
                     product={product}
                     isInCart={isInCart}
                     size="sm"
                  />
                  <AddToCartButton
                     product={product}
                     isInCart={isInCart}
                     size="sm"
                  />
               </div>
            </div>
         </div>
      </Card>
   );
};
