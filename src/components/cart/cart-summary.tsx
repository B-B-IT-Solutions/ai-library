"use client";

import { FC } from "react";
import { isEmpty } from "es-toolkit/compat";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DCart } from "@/data/types/domain/cart";

type CartSummaryProps = {
   cart: DCart;
};

export const CartSummary: FC<CartSummaryProps> = ({ cart }) => {
   const router = useRouter();

   const handleCheckout = () => {
      router.push("/checkout");
   };

   return (
      <Card className="p-4" data-testid="cart-summary">
         <CardHeader className="p-0 mb-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
         </CardHeader>
         <CardContent className="p-0 space-y-3">
            <div className="flex justify-between text-sm">
               <span className="text-slate-600">
                  Items ({cart.items.length})
               </span>
               <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3 flex justify-between">
               <span className="font-semibold">Total</span>
               <span className="font-bold text-lg">
                  ${cart.total.toFixed(2)}
               </span>
            </div>

            <Button
               onClick={handleCheckout}
               className="w-full"
               disabled={isEmpty(cart.items)}
               data-testid="checkout-btn"
            >
               Proceed to Checkout
            </Button>
         </CardContent>
      </Card>
   );
};
