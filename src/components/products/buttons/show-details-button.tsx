"use client";

import { FC, useEffect, useState, useTransition } from "react";
import { Info } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { getBundleValue } from "@/data/actions/product";
import { DProduct } from "@/data/types/domain/product";
import { cn } from "@/lib/utils";
import { ProductDetailsDialog } from "../product/product-details-dialog";
import type { BundleValue } from "../product/product-details-dialog/types";

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
   const [bundleValue, setBundleValue] = useState<BundleValue | null>(null);
   const [isPending, startTransition] = useTransition();

   // Fetch bundle value when dialog opens and product is a bundle
   useEffect(() => {
      if (showDetails && product.type === "BUNDLE" && !bundleValue) {
         startTransition(async () => {
            const value = await getBundleValue(product);
            setBundleValue(value);
         });
      }
   }, [showDetails, product, bundleValue]);

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
            bundleValue={bundleValue}
         />
      </>
   );
};
