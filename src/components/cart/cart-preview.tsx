import { FC } from "react";
import { isEmpty } from "es-toolkit/compat";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DCart } from "@/data/types/domain/cart";

import { RemoveFromCartButton } from "./remove-from-cart-button";

type CartPreviewProps = {
   cart: DCart;
};

export const CartPreview: FC<CartPreviewProps> = ({ cart }) => {
   const emptyCart = () => {
      return (
         <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Your cart is empty</p>
            <p className="text-xs text-slate-400 mt-1">
               Add items to get started
            </p>
         </div>
      );
   };

   const cartWithItems = () => {
      return (
         <>
            {/* Cart Items */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
               {cart.items.map((item) => (
                  <div
                     key={item.id}
                     className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 truncate">
                           {item.productName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-xs text-slate-600">
                              {item.productType}
                           </span>
                           <span className="text-xs text-slate-400">•</span>
                           <span className="text-xs font-medium text-indigo-600">
                              CHF {item.productPrice}
                           </span>
                        </div>
                     </div>
                     <RemoveFromCartButton
                        item={item}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50 bg-transparent hover:bg-transparent"
                     />
                  </div>
               ))}
            </div>

            {/* Summary */}
            <div className="border-t pt-4 space-y-2">
               <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">CHF {cart.subtotal}</span>
               </div>
               <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-indigo-600">CHF {cart.total}</span>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
               <Button asChild={true} className="w-full" size="lg">
                  <Link href="/checkout" data-testid="checkout-link">
                     Proceed to Checkout
                  </Link>
               </Button>
               <Button
                  asChild={true}
                  variant="outline"
                  className="w-full"
                  size="sm"
               >
                  <Link href="/cart" data-testid="cart-link">
                     View Full Cart
                  </Link>
               </Button>
            </div>
         </>
      );
   };

   return (
      <Card className="shadow-lg" data-testid="cart-preview">
         <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-slate-600" />
                  <h3 className="text-lg font-semibold">Your Cart</h3>
               </div>
               <span className="text-sm text-slate-600">
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "item" : "items"}
               </span>
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            {isEmpty(cart.items) ? emptyCart() : cartWithItems()}
         </CardContent>
      </Card>
   );
};
