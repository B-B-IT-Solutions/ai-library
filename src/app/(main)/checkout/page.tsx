"use client";

import { map } from "es-toolkit/compat";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { useCart } from "@/data/ts-queries/cart/cart";

export default function CheckoutPage() {
   const { data: cart, isLoading } = useCart();

   if (isLoading) {
      return (
         <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="animate-pulse">
               <div className="h-8 bg-slate-200 rounded w-32 mb-8" />
               <div className="space-y-6">
                  <div className="h-48 bg-slate-100 rounded-lg" />
                  <div className="h-64 bg-slate-100 rounded-lg" />
               </div>
            </div>
         </div>
      );
   }

   if (!cart || cart.items.length === 0) {
      redirect("/cart");
   }

   return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
         <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

         <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
               <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
               <div className="space-y-3">
                  {map(cart.items, (item) => (
                     <div
                        key={item.id}
                        className="flex justify-between text-sm"
                     >
                        <span className="text-slate-600">
                           {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                           ${item.lineTotal.toFixed(2)}
                        </span>
                     </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-semibold">
                     <span>Total</span>
                     <span>${cart.total.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
               <CheckoutForm cart={cart} />
            </div>
         </div>
      </div>
   );
}
