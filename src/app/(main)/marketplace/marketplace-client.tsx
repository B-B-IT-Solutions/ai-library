"use client";

import { map } from "es-toolkit/compat";

import { CartPreview } from "@/components/cart/cart-preview";
import { ProductCard } from "@/components/products/product-card";
import { useCart } from "@/data/ts-queries/cart/cart";
import { useLoadProducts } from "@/data/ts-queries/product/product";

export const MarketplaceClient = () => {
   const { data: products, isLoading: productsLoading } = useLoadProducts();
   const { data: cart, isLoading: cartLoading } = useCart();

   if (productsLoading || cartLoading) {
      return (
         <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                     <div
                        key={i}
                        className="h-64 bg-slate-100 animate-pulse rounded-lg"
                     />
                  ))}
               </div>
            </div>
            <div className="w-full lg:w-80">
               <div className="h-64 bg-slate-100 animate-pulse rounded-lg" />
            </div>
         </div>
      );
   }

   if (!products || products.length === 0) {
      return (
         <div className="text-center py-12">
            <p className="text-slate-600">
               No products available at the moment.
            </p>
         </div>
      );
   }

   return (
      <div className="flex flex-col lg:flex-row gap-8">
         {/* Products Grid */}
         <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {map(products, (product) => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>
         </div>

         {/* Cart Preview Sidebar */}
         <div className="w-full lg:w-80">
            <div className="sticky top-4">
               {cart && <CartPreview cart={cart} />}
            </div>
         </div>
      </div>
   );
};
