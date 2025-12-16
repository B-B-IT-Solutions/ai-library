"use client";

import { FC } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DCart } from "@/data/types/domain/cart";
import { useRemoveFromCart } from "@/data/ts-queries/cart/cart";
import { toast } from "sonner";

type CartPreviewProps = {
   cart: DCart;
};

export const CartPreview: FC<CartPreviewProps> = ({ cart }) => {
   const router = useRouter();
   const removeFromCart = useRemoveFromCart();

   const handleRemoveItem = (itemId: string, productName: string) => {
      removeFromCart.mutate(itemId, {
         onSuccess: (result) => {
            if (result.success) {
               toast.success(`${productName} removed from cart`);
            } else {
               toast.error(result.message);
            }
         },
      });
   };

   const handleCheckout = () => {
      router.push("/checkout");
   };

   const handleViewCart = () => {
      router.push("/cart");
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
                  {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
               </span>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            {cart.items.length === 0 ? (
               <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Your cart is empty</p>
                  <p className="text-xs text-slate-400 mt-1">
                     Add items to get started
                  </p>
               </div>
            ) : (
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
                                    Qty: {item.quantity}
                                 </span>
                                 <span className="text-xs text-slate-400">•</span>
                                 <span className="text-xs font-medium text-indigo-600">
                                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                 </span>
                              </div>
                           </div>
                           <button
                              onClick={() => handleRemoveItem(item.id, item.product.name)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item"
                              disabled={removeFromCart.isPending}
                           >
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                     ))}
                  </div>

                  {/* Summary */}
                  <div className="border-t pt-4 space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span className="text-indigo-600">${cart.total.toFixed(2)}</span>
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
            )}
         </CardContent>
      </Card>
   );
};
