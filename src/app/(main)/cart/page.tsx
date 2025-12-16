"use client";

import { map } from "es-toolkit/compat";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/shadcn/button";
import { useCart } from "@/data/ts-queries/cart/cart";

export default function CartPage() {
   const { data: cart, isLoading } = useCart();

   if (isLoading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
               <div className="h-8 bg-slate-200 rounded w-32 mb-8" />
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-lg" />
                     ))}
                  </div>
                  <div className="h-48 bg-slate-100 rounded-lg" />
               </div>
            </div>
         </div>
      );
   }

   if (!cart || cart.items.length === 0) {
      return (
         <div className="container mx-auto px-4 py-8">
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
               <Link href="/marketplace">
                  <Button>Browse Marketplace</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold text-slate-900 mb-8">
            Shopping Cart
         </h1>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
               {map(cart.items, (item) => (
                  <CartItem key={item.id} item={item} />
               ))}

               <Link href="/marketplace">
                  <Button variant="outline" className="w-full">
                     Continue Shopping
                  </Button>
               </Link>
            </div>

            <div>
               <CartSummary cart={cart} showCheckoutButton={true} />
            </div>
         </div>
      </div>
   );
}
