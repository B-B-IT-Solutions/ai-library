import { isEmpty, map } from "es-toolkit/compat";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCart } from "@/data/actions/cart";

export const metadata: Metadata = {
   title: "Checkout",
};

export const CheckoutPage = async () => {
   const cart = await getCart();

   if (isEmpty(cart.items)) {
      return redirect("/cart");
   }

   return (
      <div
         className="container mx-auto max-w-2xl px-4 py-8"
         data-testid="checkout-page"
      >
         <h1 className="mb-8 text-3xl font-bold text-slate-900">Checkout</h1>

         <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
               <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
               <div className="space-y-3">
                  {map(cart.items, (item) => (
                     <div
                        key={item.id}
                        className="flex justify-between text-sm"
                        data-testid="cart-item"
                     >
                        <span className="text-slate-600">
                           {item.productName}
                        </span>
                        <span className="font-medium">
                           CHF {item.lineTotal.toFixed(2)}
                        </span>
                     </div>
                  ))}
                  <div className="flex justify-between border-t pt-3 font-semibold">
                     <span>Total</span>
                     <span>CHF {cart.total.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
               <CheckoutForm cart={cart} />
            </div>
         </div>
      </div>
   );
};

export default CheckoutPage;
