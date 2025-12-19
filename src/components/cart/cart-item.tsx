import { FC } from "react";

import { DCartItem } from "@/data/types/domain/cart";

import { RemoveFromCartButton } from "./remove-from-cart-button";

type CartItemProps = {
   item: DCartItem;
};

export const CartItem: FC<CartItemProps> = ({ item }) => {
   return (
      <div
         className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg"
         data-testid="cart-item"
      >
         <div className="flex-1">
            <h4 className="font-medium text-slate-900">{item.productName}</h4>
            <p className="text-sm text-slate-600">
               {item.productType} · CHF {item.productPrice}
            </p>
         </div>
         <div className="w-24 text-right">
            <p className="font-bold text-slate-900">CHF {item.lineTotal}</p>
         </div>
         <RemoveFromCartButton item={item} iconX={true} />
      </div>
   );
};
