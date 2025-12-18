"use client";

import { FC, useTransition } from "react";
import { Loader, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { removeFromCart } from "@/data/actions/cart/cart.actions";
import { DCartItem } from "@/data/types/domain/cart";

type RemoveFromCartButtonProps = {
   item: DCartItem;
   iconX?: boolean;
   className?: string;
};

export const RemoveFromCartButton: FC<RemoveFromCartButtonProps> = ({
   item,
   iconX,
   className,
}) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleRemove = () => {
      startTransition(async () => {
         const result = await removeFromCart(item.id);
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
      if (isPending) {
         return <Loader className="w-4 h-4" />;
      }
      if (iconX) {
         return <X className="w-4 h-4" />;
      }
      return <Trash2 className="h-4 w-4" />;
   };

   return (
      <Button
         variant="ghost"
         size="icon"
         className={className}
         onClick={handleRemove}
         disabled={isPending}
         data-testid="remove-from-cart-btn"
      >
         {icon()}
      </Button>
   );
};
