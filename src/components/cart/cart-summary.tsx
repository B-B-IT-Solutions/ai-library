import { FC } from "react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DCart } from "@/data/types/domain/cart";

type CartSummaryProps = {
   cart: DCart;
};

export const CartSummary: FC<CartSummaryProps> = ({ cart }) => {
   return (
      <Card className="p-4" data-testid="cart-summary">
         <CardHeader className="p-0 mb-4">
            <h3 className="text-lg font-semibold">Bestellübersicht</h3>
         </CardHeader>
         <CardContent className="p-0 space-y-3">
            <div className="flex justify-between text-sm">
               <span className="text-slate-600">
                  Artikel ({cart.items.length})
               </span>
               <span className="font-medium">CHF {cart.subtotal}</span>
            </div>

            <div className="border-t pt-3 flex justify-between">
               <span className="font-semibold">Gesamt</span>
               <span className="font-bold text-lg">CHF {cart.total}</span>
            </div>

            <Button asChild={true}>
               <Link
                  href="/checkout"
                  className="w-full"
                  data-testid="checkout-link"
               >
                  Zur Kasse
               </Link>
            </Button>
         </CardContent>
      </Card>
   );
};
