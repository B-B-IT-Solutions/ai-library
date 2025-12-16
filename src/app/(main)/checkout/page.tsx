import { map } from "es-toolkit/compat";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCartSummary } from "@/data/actions/cart/cart.actions";

export default async function CheckoutPage() {
   const cart = await getCartSummary();

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
