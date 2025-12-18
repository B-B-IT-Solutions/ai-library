"use client";

import { FC, useState } from "react";

import { DCart } from "@/data/types/domain/cart";

import { CartDrawer } from "./cart-drawer";
import { FloatingCartButton } from "./floating-cart-button";

type CartControlsProps = {
   cart: DCart;
};

export const CartControls: FC<CartControlsProps> = ({ cart }) => {
   const [isCartOpen, setIsCartOpen] = useState(false);

   return (
      <div data-testid="cart-controls">
         <FloatingCartButton cart={cart} onClick={() => setIsCartOpen(true)} />
         <CartDrawer
            initialCart={cart}
            open={isCartOpen}
            onOpenChange={setIsCartOpen}
         />
      </div>
   );
};
