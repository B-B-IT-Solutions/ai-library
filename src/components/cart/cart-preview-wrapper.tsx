"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DCart } from "@/data/types/domain/cart";
import { CartPreview } from "./cart-preview";

type CartPreviewWrapperProps = {
   initialCart: DCart;
};

export const CartPreviewWrapper: FC<CartPreviewWrapperProps> = ({
   initialCart,
}) => {
   const [cart, setCart] = useState<DCart>(initialCart);
   const router = useRouter();

   // Update cart when initialCart changes (e.g., after page navigation)
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
      router.refresh(); // Refresh server components
   };

   return <CartPreview cart={cart} onCartChange={handleCartChange} />;
};
