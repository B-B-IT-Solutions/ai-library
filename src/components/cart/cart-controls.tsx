"use client";

import { FC, useState } from "react";

import { DCart } from "@/data/types/domain/cart";

import { CartDrawer } from "./cart-drawer";
import { FloatingCartButton } from "./floating-cart-button";

type CartControlsProps = {
   cart: DCart;
};

export const CartControls: FC<CartControlsProps> = ({ cart }) => {
   const [isDrawer, setDrawerOpen] = useState(false);

   return (
      <div data-testid="cart-controls">
         <FloatingCartButton cart={cart} onClick={() => setDrawerOpen(true)} />
         <CartDrawer cart={cart} open={isDrawer} onOpenChange={setDrawerOpen} />
      </div>
   );
};
