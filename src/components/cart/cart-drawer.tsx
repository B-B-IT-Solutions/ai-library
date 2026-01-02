"use client";

import { FC } from "react";

import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from "@/components/shadcn/sheet";
import { DCart } from "@/data/types/domain/cart";

import { CartPreview } from "./cart-preview";

type CartDrawerProps = {
   cart: DCart;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const CartDrawer: FC<CartDrawerProps> = ({
   cart,
   open,
   onOpenChange,
}) => {
   return (
      <Sheet open={open} onOpenChange={onOpenChange} data-testid="cart-drawer">
         <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader className="sr-only">
               <SheetTitle>Warenkorb</SheetTitle>
            </SheetHeader>
            <div className="h-full flex flex-col">
               <CartPreview cart={cart} />
            </div>
         </SheetContent>
      </Sheet>
   );
};
