import { isEmpty, map } from "es-toolkit/compat";
import { ShoppingBag } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/shadcn/button";
import { getCart } from "@/data/actions/cart";

export const metadata: Metadata = {
   title: "Cart",
};

export const CartPage = async () => {
   const cart = await getCart();

   if (isEmpty(cart.items)) {
      return (
         <div
            className="container mx-auto px-4 py-8"
            data-testid="cart-page-empty"
         >
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
               Shopping Cart
            </h1>
            <div className="text-center py-12">
               <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Your cart is empty
               </h2>
               <p className="text-slate-600 mb-6">
                  Start shopping to add items to your cart
               </p>
               <Link href="/marketplace" data-testid="market-place-link">
                  <Button>Browse Marketplace</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8" data-testid="cart-page">
         <h1 className="text-3xl font-bold text-slate-900 mb-8">
            Shopping Cart
         </h1>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
               {map(cart.items, (item) => (
                  <CartItem key={item.id} item={item} />
               ))}

               <Link href="/marketplace" data-testid="continue-shopping-link">
                  <Button variant="outline" className="w-full">
                     Continue Shopping
                  </Button>
               </Link>
            </div>

            <div>
               <CartSummary cart={cart} />
            </div>
         </div>
      </div>
   );
};

export default CartPage;
