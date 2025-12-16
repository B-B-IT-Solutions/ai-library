"use client";

import { FC, useEffect, useState } from "react";

import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from "@/components/shadcn/sheet";
import { DCart } from "@/data/types/domain/cart";

import { CartPreview } from "./cart-preview";

type CartDrawerProps = {
   initialCart: DCart;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const CartDrawer: FC<CartDrawerProps> = ({
   initialCart,
   open,
   onOpenChange,
}) => {
   const [cart, setCart] = useState<DCart>(initialCart);

   // Update cart when initialCart changes
   useEffect(() => {
      setCart(initialCart);
   }, [initialCart]);

   // Listen for custom cart update events
   useEffect(() => {
      const handleCartUpdate = (event: CustomEvent<DCart>) => {
         setCart(event.detail);
      };

      window.addEventListener(
         "cart-updated" as any,
         handleCartUpdate as EventListener
      );

      return () => {
         window.removeEventListener(
            "cart-updated" as any,
            handleCartUpdate as EventListener
         );
      };
   }, []);

   const handleCartChange = (updatedCart: DCart) => {
      setCart(updatedCart);
   };

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader className="sr-only">
               <SheetTitle>Shopping Cart</SheetTitle>
            </SheetHeader>
            <div className="h-full flex flex-col">
               <CartPreview cart={cart} onCartChange={handleCartChange} />
            </div>
         </SheetContent>
      </Sheet>
   );
};
