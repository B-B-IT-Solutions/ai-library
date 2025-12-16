"use client";

import { FC } from "react";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   useRemoveFromCart,
   useUpdateCartQuantity,
} from "@/data/ts-queries/cart/cart";
import { DCartItem } from "@/data/types/domain/cart";

type CartItemProps = {
   item: DCartItem;
};

export const CartItem: FC<CartItemProps> = ({ item }) => {
   const removeFromCart = useRemoveFromCart();
   const updateQuantity = useUpdateCartQuantity();

   const handleRemove = () => {
      removeFromCart.mutate(item.id, {
         onSuccess: (result) => {
            if (result.success) {
               toast.success(result.message);
            } else {
               toast.error(result.message);
            }
         },
      });
   };

   const handleUpdateQuantity = (newQuantity: number) => {
      if (newQuantity < 1) return;

      updateQuantity.mutate(
         { itemId: item.id, quantity: newQuantity },
         {
            onSuccess: (result) => {
               if (!result.success) {
                  toast.error(result.message);
               }
            },
         }
      );
   };

   return (
      <div
         className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg"
         data-testid="cart-item"
      >
         <div className="flex-1">
            <h4 className="font-medium text-slate-900">{item.product.name}</h4>
            <p className="text-sm text-slate-600">
               {item.product.type} · ${item.product.price.toFixed(2)} each
            </p>
         </div>

         <div className="flex items-center gap-2">
            <Button
               variant="outline"
               size="icon"
               onClick={() => handleUpdateQuantity(item.quantity - 1)}
               disabled={item.quantity <= 1 || updateQuantity.isPending}
               data-testid="decrease-quantity"
            >
               <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
               variant="outline"
               size="icon"
               onClick={() => handleUpdateQuantity(item.quantity + 1)}
               disabled={updateQuantity.isPending}
               data-testid="increase-quantity"
            >
               <Plus className="w-4 h-4" />
            </Button>
         </div>

         <div className="w-24 text-right">
            <p className="font-bold text-slate-900">
               ${item.lineTotal.toFixed(2)}
            </p>
         </div>

         <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={removeFromCart.isPending}
            data-testid="remove-item"
         >
            <X className="w-4 h-4" />
         </Button>
      </div>
   );
};
