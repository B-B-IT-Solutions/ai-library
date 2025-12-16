"use client";

import { FC, useTransition } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { removeFromCart } from "@/data/actions/cart/cart.actions";
import { DCartItem } from "@/data/types/domain/cart";

type CartItemProps = {
   item: DCartItem;
};

export const CartItem: FC<CartItemProps> = ({ item }) => {
   const router = useRouter();
   const [isRemoving, startRemoveTransition] = useTransition();

   const handleRemove = () => {
      startRemoveTransition(async () => {
         const result = await removeFromCart(item.id);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <div
         className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg"
         data-testid="cart-item"
      >
         <div className="flex-1">
            <h4 className="font-medium text-slate-900">{item.product.name}</h4>
            <p className="text-sm text-slate-600">
               {item.product.type} · ${item.product.price.toFixed(2)}
            </p>
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
            disabled={isRemoving}
            data-testid="remove-item"
         >
            <X className="w-4 h-4" />
         </Button>
      </div>
   );
};
