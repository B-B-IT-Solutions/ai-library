"use client";

import { FC, useTransition } from "react";
import { isEmpty } from "es-toolkit/compat";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { removeFromCart } from "@/data/actions/cart/cart.actions";
import { DCart } from "@/data/types/domain/cart";

import { RemoveFromCartButton } from "./remove-from-cart-button";

type CartPreviewProps = {
   cart: DCart;
   onCartChange?: (cart: DCart) => void;
};

export const CartPreview: FC<CartPreviewProps> = ({ cart, onCartChange }) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleRemoveItem = async (itemId: string, productName: string) => {
      startTransition(async () => {
         const result = await removeFromCart(itemId);
         if (result.success) {
            toast.success(`${productName} removed from cart`);
            if (result.data && onCartChange) {
               onCartChange(result.data);
            }
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const handleCheckout = () => {
      router.push("/checkout");
   };

   const handleViewCart = () => {
      router.push("/cart");
   };

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
                           {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-xs text-slate-600">
                              {item.product.type}
                           </span>
                           <span className="text-xs text-slate-400">•</span>
                           <span className="text-xs font-medium text-indigo-600">
                              ${item.product.price.toFixed(2)}
                           </span>
                        </div>
                     </div>
                     <Button
                        onClick={() =>
                           handleRemoveItem(item.id, item.product.name)
                        }
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50 bg-transparent hover:bg-transparent"
                        aria-label="Remove item"
                        disabled={isPending}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
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
                  <span className="font-medium">
                     ${cart.subtotal.toFixed(2)}
                  </span>
               </div>
               <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-indigo-600">
                     ${cart.total.toFixed(2)}
                  </span>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
               <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  data-testid="checkout-button"
               >
                  Proceed to Checkout
               </Button>
               <Button
                  onClick={handleViewCart}
                  variant="outline"
                  className="w-full"
                  size="sm"
               >
                  View Full Cart
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
