"use client";

import { FC, useState } from "react";
import { Info } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DProduct } from "@/data/types/domain/product";
import { cn } from "@/lib/utils";
import { ProductDetailsDialog } from "../product/product-details-dialog";

type AddToCartButtonProps = {
   product: DProduct;
   isInCart: boolean;
   size?: "sm" | "default";
};

export const ShowDetailsButton: FC<AddToCartButtonProps> = ({
   product,
   isInCart,
   size,
}) => {
   const [showDetails, setShowDetails] = useState(false);

   return (
      <>
         <Button
            onClick={() => setShowDetails(true)}
            variant="outline"
            className={cn(
               "flex-1 cursor-pointer",
               size == "sm" ? "sm:flex-initial" : undefined
            )}
            data-testid="view-details-btn"
         >
            <Info
               className={cn("w-4 h-4", size == "sm" ? "sm:mr-1" : "mr-2")}
            />
            <span className={size == "sm" ? "hidden sm:inline" : undefined}>
               Details
            </span>
         </Button>
         <ProductDetailsDialog
            product={product}
            open={showDetails}
            onClose={() => setShowDetails(false)}
            isInCart={isInCart}
         />
      </>
   );
};
