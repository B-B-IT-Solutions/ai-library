"use client";

import { useState } from "react";
import { map } from "es-toolkit/compat";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingCartButton } from "@/components/cart/floating-cart-button";
import { ProductCard } from "@/components/products/product-card";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";

type MarketplaceClientProps = {
   products: DProduct[];
   initialCart: DCart;
};

export const MarketplaceClient = ({
   products,
   initialCart,
}: MarketplaceClientProps) => {
   const [isCartOpen, setIsCartOpen] = useState(false);

   if (!products || products.length === 0) {
      return (
         <div className="text-center py-12">
            <p className="text-slate-600">
               No products available at the moment.
            </p>
         </div>
      );
   }

   // Get IDs of products already in cart
   const cartProductIds = new Set(
      initialCart.items.map((item) => item.product.id)
   );

   return (
      <>
         {/* Products Grid - Now Full Width */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {map(products, (product) => (
               <ProductCard
                  key={product.id}
                  product={product}
                  isInCart={cartProductIds.has(product.id)}
               />
            ))}
         </div>

         {/* Floating Cart Button */}
         <FloatingCartButton
            initialCart={initialCart}
            onClick={() => setIsCartOpen(true)}
         />

         {/* Cart Drawer */}
         <CartDrawer
            initialCart={initialCart}
            open={isCartOpen}
            onOpenChange={setIsCartOpen}
         />
      </>
   );
};
