import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";

import { Card } from "@/components/shadcn/card";
import { DProduct } from "@/data/types/domain/product";
import { AddToCartButton } from "../buttons/add-to-cart-button";
import { ShowDetailsButton } from "../buttons/show-details-button";
import { getTypeBadgeColor, resolveUniqCategories } from "../utils";

type ProductListItemProps = {
   product: DProduct;
   isInCart: boolean;
};

export const ProductListItem: FC<ProductListItemProps> = ({
   product,
   isInCart,
}) => {
   const { productItems } = product;

   const typeBadge = () => {
      return (
         <span
            className={`text-xs px-2 py-0.5 rounded border ${getTypeBadgeColor(
               product.type
            )}`}
         >
            {product.type}
         </span>
      );
   };

   const categories = () => {
      const cats = resolveUniqCategories(productItems);
      if (!isEmpty(cats)) {
         return (
            <div className="flex flex-wrap gap-1" data-testid="categories">
               {map(cats, (cat) => (
                  <span
                     key={cat.name}
                     className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
                  >
                     {cat.name}
                  </span>
               ))}
            </div>
         );
      }
   };

   const itemsInfo = () => {
      if (!isEmpty(productItems)) {
         return (
            <span className="flex items-center gap-1">
               {`${productItems.length} templates included`}
            </span>
         );
      }
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
                  {itemsInfo()}
               </div>
            </div>

            {/* Right: Price and Actions */}
            <div className="flex flex-col items-end gap-3 sm:min-w-[200px]">
               <p className="text-2xl font-bold text-slate-900">
                  CHF {product.price}
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
