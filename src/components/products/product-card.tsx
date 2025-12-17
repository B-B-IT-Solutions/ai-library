import { FC } from "react";
import { map } from "es-toolkit/compat";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DProduct } from "@/data/types/domain/product";

import { AddToCartButton } from "./add-to-cart-button";
import { ShowDetailsButton } from "./show-details-button";

type ProductCardProps = {
   product: DProduct;
   isInCart: boolean;
};

export const ProductCard: FC<ProductCardProps> = ({ product, isInCart }) => {
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
      if (!product.template?.categories) return null;

      return (
         <div className="flex flex-wrap gap-1 mb-2" data-testid="categories">
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
      if (product.type !== "BUNDLE" || !product.bundleItems) return null;

      return (
         <p className="text-xs text-slate-600 mb-2">
            {product.bundleItems.length} templates included
         </p>
      );
   };

   return (
      <Card
         className="p-4 gap-0 bg-white border border-slate-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
         data-testid="product-card"
      >
         <CardHeader className="p-0 gap-2 mb-3">
            <div className="flex items-start justify-between gap-2">
               <h4 className="font-medium text-slate-900 flex-1">
                  {product.name}
               </h4>
               {typeBadge()}
            </div>
            <p className="text-2xl font-bold text-slate-900">
               ${product.price.toFixed(2)}
            </p>
         </CardHeader>
         <CardContent className="p-0 grid gap-2">
            {categories()}
            {bundleInfo()}
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
               {product.description}
            </p>

            <div className="flex gap-2">
               <ShowDetailsButton product={product} />
               <AddToCartButton product={product} isInCart={isInCart} />
            </div>
         </CardContent>
      </Card>
   );
};
