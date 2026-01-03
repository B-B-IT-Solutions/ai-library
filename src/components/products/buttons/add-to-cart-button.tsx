"use client";

import { FC, useTransition } from "react";
import { Check, Loader, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { addToCart } from "@/data/actions/cart/cart.actions";
import { DProduct } from "@/data/types/domain/product";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
   product: DProduct;
   isInCart: boolean;
   size?: "default" | "lg" | "sm";
};

export const AddToCartButton: FC<AddToCartButtonProps> = ({
   product,
   isInCart,
   size,
}) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleAddToCart = () => {
      startTransition(async () => {
         const result = await addToCart(product);
         if (result.success) {
            toast.success(result.message, {
               duration: 1000,
            });
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const icon = () => {
      if (isInCart) {
         return (
            <>
               <Check
                  className={cn("w-4 h-4", size == "sm" ? "sm:mr-1" : "mr-2")}
               />
               <span className={size == "sm" ? "hidden sm:inline" : undefined}>
                  Im Warenkorb
               </span>
            </>
         );
      }

      if (isPending) {
         return (
            <>
               <Loader
                  className={cn(
                     "w-4 h-4 animate-spin",
                     size == "sm" ? "sm:mr-1" : "mr-2"
                  )}
               />
               <span className={size == "sm" ? "hidden sm:inline" : undefined}>
                  Wird hinzugefügt...
               </span>
            </>
         );
      }

      return (
         <>
            <ShoppingCart
               className={cn("w-4 h-4", size == "sm" ? "sm:mr-1" : "mr-2")}
            />
            <span className={size == "sm" ? "hidden sm:inline" : undefined}>
               {size == "sm" ? "Hinzufügen" : "In den Warenkorb"}
            </span>
         </>
      );
   };

   return (
      <Button
         onClick={handleAddToCart}
         disabled={isPending || isInCart}
         className={cn(
            "flex-1 cursor-pointer",
            size == "sm" ? "sm:flex-initial" : undefined
         )}
         variant={isInCart ? "secondary" : "default"}
         size={size ? size : "default"}
         data-testid="add-to-cart-btn"
      >
         {icon()}
      </Button>
   );
};
