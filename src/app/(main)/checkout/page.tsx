import { isEmpty, map } from "es-toolkit/compat";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCart } from "@/data/actions/cart";

export const metadata: Metadata = {
   title: "Checkout",
};

export const CheckoutPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const cart = await getCart();

   if (isEmpty(cart.items)) {
      return redirect("/cart");
   }

   return (
      <div
         className="container mx-auto px-4 py-8 max-w-2xl"
         data-testid="checkout-page"
      >
         <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
               <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
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
                  <div className="border-t pt-3 flex justify-between font-semibold">
                     <span>Total</span>
                     <span>CHF {cart.total.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
               <CheckoutForm cart={cart} />
            </div>
         </div>
      </div>
   );
};

export default CheckoutPage;
