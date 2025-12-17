"use client";

import { FC, useEffect, useState, useTransition } from "react";
import { map } from "es-toolkit/compat";
import { Check, Info, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { addToCart } from "@/data/actions/cart/cart.actions";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";

import { ProductDetailsDialog } from "./product-details-dialog";

type ProductListItemProps = {
   product: DProduct;
   isInCart: boolean;
};

export const ProductListItem: FC<ProductListItemProps> = ({
   product,
   isInCart: initialIsInCart = false,
}) => {
   const [showDetails, setShowDetails] = useState(false);
   const [isPending, startTransition] = useTransition();
   const [isInCart, setIsInCart] = useState(initialIsInCart);

   // Listen for cart updates to update button state in real-time
   useEffect(() => {
      const handleCartUpdate = (event: CustomEvent<DCart>) => {
         const inCart = event.detail.items.some(
            (item) => item.product.id === product.id
         );
         setIsInCart(inCart);
      };

      window.addEventListener(
         "cart-updated" as any,
         handleCartUpdate as EventListener
      );

      return () => {
         window.removeEventListener(
            "cart-updated" as any,
            handleCartUpdate as EventListener
         );
      };
   }, [product.id]);

   const handleAddToCart = () => {
      startTransition(async () => {
         const result = await addToCart(product.id, 1);
         if (result.success) {
            toast.success(result.message);
            if (result.data) {
               window.dispatchEvent(
                  new CustomEvent("cart-updated", { detail: result.data })
               );
            }
         } else {
            toast.error(result.message);
         }
      });
   };

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
      if (product.type !== "BUNDLE" || !product.bundleItems) return null;
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
                  <Button
                     onClick={() => setShowDetails(true)}
                     variant="outline"
                     size="sm"
                     className="flex-1 sm:flex-initial"
                     data-testid="view-details-button"
                  >
                     <Info className="w-4 h-4 sm:mr-2" />
                     <span className="hidden sm:inline">Details</span>
                  </Button>
                  <Button
                     onClick={handleAddToCart}
                     disabled={isPending || isInCart}
                     size="sm"
                     variant={isInCart ? "secondary" : "default"}
                     className="flex-1 sm:flex-initial"
                     data-testid="add-to-cart-button"
                  >
                     {isInCart ? (
                        <>
                           <Check className="w-4 h-4 sm:mr-2" />
                           <span className="hidden sm:inline">In Cart</span>
                        </>
                     ) : (
                        <>
                           <ShoppingCart className="w-4 h-4 sm:mr-2" />
                           <span className="hidden sm:inline">
                              {isPending ? "Adding..." : "Add"}
                           </span>
                        </>
                     )}
                  </Button>
               </div>
            </div>
         </div>

         <ProductDetailsDialog
            product={product}
            open={showDetails}
            onClose={() => setShowDetails(false)}
            isInCart={isInCart}
         />
      </Card>
   );
};
