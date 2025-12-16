"use client";

import { FC } from "react";
import { map } from "es-toolkit/compat";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { useAddToCart } from "@/data/ts-queries/cart/cart";
import { DProduct } from "@/data/types/domain/product";

type ProductCardProps = {
   product: DProduct;
};

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
   const addToCart = useAddToCart();

   const handleAddToCart = () => {
      addToCart.mutate(
         { productId: product.id, quantity: 1 },
         {
            onSuccess: (result) => {
               if (result.success) {
                  toast.success(result.message);
               } else {
                  toast.error(result.message);
               }
            },
         }
      );
   };

   const typeBadge = () => {
      const colors = {
         TEMPLATE: "bg-blue-100 text-blue-700 border-blue-200",
         BUNDLE: "bg-purple-100 text-purple-700 border-purple-200",
         SUBSCRIPTION: "bg-green-100 text-green-700 border-green-200",
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

   const subscriptionInfo = () => {
      if (product.type !== "SUBSCRIPTION" || !product.subscriptionDuration)
         return null;

      const days = product.subscriptionDuration;
      const months = Math.floor(days / 30);

      return (
         <p className="text-xs text-slate-600 mb-2">
            {months > 0
               ? `${months} month${months > 1 ? "s" : ""}`
               : `${days} days`}{" "}
            access
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
            {subscriptionInfo()}
            <p className="text-sm text-slate-600 line-clamp-2 mb-2">
               {product.description}
            </p>
            <Button
               onClick={handleAddToCart}
               disabled={addToCart.isPending}
               className="w-full"
               data-testid="add-to-cart-button"
            >
               <ShoppingCart className="w-4 h-4 mr-2" />
               {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </Button>
         </CardContent>
      </Card>
   );
};
