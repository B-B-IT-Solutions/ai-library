"use client";

import { FC, useTransition } from "react";
import { Check, Loader, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { addToCart } from "@/data/actions/cart/cart.actions";
import { DProduct } from "@/data/types/domain/product";

type AddToCartButtonProps = {
   product: DProduct;
   isInCart: boolean;
};

export const AddToCartButton: FC<AddToCartButtonProps> = ({
   product,
   isInCart,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleAddToCart = () => {
      startTransition(async () => {
         const result = await addToCart(product.id, 1);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   const icon = () => {
      if (isInCart) {
         return (
            <>
               <Check className="w-4 h-4 mr-2" />
               In Cart
            </>
         );
      }

      if (isPending) {
         return (
            <>
               <Loader className="w-4 h-4 animate-spin mr-2" />
               Adding...
            </>
         );
      }

      return (
         <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
         </>
      );
   };

   return (
      <Button
         onClick={handleAddToCart}
         disabled={isPending || isInCart}
         className="flex-1 cursor-pointer"
         variant={isInCart ? "secondary" : "default"}
         data-testid="add-to-cart-btn"
      >
         {icon()}
      </Button>
   );
};
