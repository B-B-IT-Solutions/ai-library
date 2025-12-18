"use client";

import { FC } from "react";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DCart } from "@/data/types/domain/cart";

type FloatingCartButtonProps = {
   cart: DCart;
   onClick: () => void;
};

export const FloatingCartButton: FC<FloatingCartButtonProps> = ({
   cart,
   onClick,
}) => {
   const itemCount = cart.items.length;

   return (
      <Button
         onClick={onClick}
         size="lg"
         className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all z-50 h-14 w-14 p-0"
         data-testid="floating-cart-btn"
      >
         <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
               <span className="absolute -top-5 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
               </span>
            )}
         </div>
      </Button>
   );
};
