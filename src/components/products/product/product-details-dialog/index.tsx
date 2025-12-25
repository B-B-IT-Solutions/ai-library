"use client";

import { FC } from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogFooter,
} from "@/components/shadcn/dialog";
import { CallbackFn } from "@/data/types/common";
import { DProduct } from "@/data/types/domain/product";
import { AddToCartButton } from "../../buttons/add-to-cart-button";
import { ProductDetails } from "../product-details";

import { ProductHeader } from "./product-header";

type ProductDetailsDialogProps = {
   product: DProduct;
   isInCart: boolean;
   open: boolean;
   onClose: CallbackFn;
};

export const ProductDetailsDialog: FC<ProductDetailsDialogProps> = ({
   product,
   isInCart,
   open,
   onClose,
}) => {
   return (
      <Dialog
         open={open}
         onOpenChange={onClose}
         data-testid="product-details-dialog"
      >
         <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
            {/* Sticky Header */}
            <div className="px-6 pt-6">
               <ProductHeader product={product} />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
               <ProductDetails product={product} />
            </div>

            {/* Sticky Footer */}
            <DialogFooter className="sticky bottom-0 border-t bg-white px-6 py-4">
               <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                     variant="ghost"
                     size="lg"
                     asChild
                     className="sm:mr-auto"
                  >
                     <Link href={`/products/${product.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Page
                     </Link>
                  </Button>
                  <AddToCartButton
                     product={product}
                     isInCart={isInCart}
                     size="lg"
                  />
                  <Button
                     onClick={onClose}
                     variant="outline"
                     size="lg"
                     data-testid="close-dialog-btn"
                  >
                     Close
                  </Button>
               </div>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
