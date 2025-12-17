"use client";

import { FC, useState } from "react";
import { Info } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DProduct } from "@/data/types/domain/product";

import { ProductDetailsDialog } from "./product-details-dialog";

type AddToCartButtonProps = {
   product: DProduct;
   isInCart: boolean;
};

export const ShowDetailsButton: FC<AddToCartButtonProps> = ({
   product,
   isInCart,
}) => {
   const [showDetails, setShowDetails] = useState(false);

   return (
      <>
         <Button
            onClick={() => setShowDetails(true)}
            variant="outline"
            className="flex-1 cursor-pointer"
            data-testid="view-details-btn"
         >
            <Info className="w-4 h-4 mr-2" />
            Details
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
