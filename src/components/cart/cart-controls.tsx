"use client";

import { FC, useState } from "react";

import { DCart } from "@/data/types/domain/cart";

import { CartDrawer } from "./cart-drawer";
import { FloatingCartButton } from "./floating-cart-button";

type CartControlsProps = {
   initialCart: DCart;
};

export const CartControls: FC<CartControlsProps> = ({ initialCart }) => {
   const [isCartOpen, setIsCartOpen] = useState(false);

   return (
      <>
         <FloatingCartButton
            initialCart={initialCart}
            onClick={() => setIsCartOpen(true)}
         />
         <CartDrawer
            initialCart={initialCart}
            open={isCartOpen}
            onOpenChange={setIsCartOpen}
         />
      </>
   );
};
