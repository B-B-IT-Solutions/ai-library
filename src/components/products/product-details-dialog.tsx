"use client";

import { FC, useTransition } from "react";
import { map } from "es-toolkit/compat";
import { Calendar, Package, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { Separator } from "@/components/shadcn/separator";
import { addToCart } from "@/data/actions/cart/cart.actions";
import { DProduct } from "@/data/types/domain/product";

type ProductDetailsDialogProps = {
   product: DProduct;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const ProductDetailsDialog: FC<ProductDetailsDialogProps> = ({
   product,
   open,
   onOpenChange,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleAddToCart = () => {
      startTransition(async () => {
         const result = await addToCart(product.id, 1);
         if (result.success) {
            toast.success(result.message);
            onOpenChange(false);
            // Dispatch custom event to update cart preview
            if (result.data) {
               window.dispatchEvent(
                  new CustomEvent("cart-updated", { detail: result.data })
               );
            }
         } else {
            toast.error(result.message);
         }
      });
   };

   const getTypeBadgeColor = () => {
      const colors = {
         TEMPLATE: "bg-blue-100 text-blue-700 border-blue-200",
         BUNDLE: "bg-purple-100 text-purple-700 border-purple-200",
         SUBSCRIPTION: "bg-green-100 text-green-700 border-green-200",
      };
      return colors[product.type];
   };

   const renderTemplateDetails = () => {
      if (product.type !== "TEMPLATE" || !product.template) return null;

      return (
         <div className="space-y-4">
            {product.template.recommendedModel && (
               <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                     <Sparkles className="h-4 w-4" />
                     Recommended Model
                  </h4>
                  <Badge variant="outline" className="text-sm">
                     {product.template.recommendedModel}
                  </Badge>
               </div>
            )}

            {product.template.categories &&
               product.template.categories.length > 0 && (
                  <div>
                     <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        Categories
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {map(product.template.categories, (cat) => (
                           <Badge key={cat.name} variant="secondary">
                              {cat.name}
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}

            {product.template.content && (
               <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                     Template Preview
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                     <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-6">
                        {product.template.content}
                     </p>
                  </div>
               </div>
            )}
         </div>
      );
   };

   const renderBundleDetails = () => {
      if (product.type !== "BUNDLE" || !product.bundleItems) return null;

      return (
         <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
               <Package className="h-4 w-4" />
               Included Templates ({product.bundleItems.length})
            </h4>
            <div className="space-y-2">
               {map(product.bundleItems, (template) => (
                  <div
                     key={template.id}
                     className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                  >
                     <h5 className="font-medium text-slate-900 text-sm mb-1">
                        {template.title}
                     </h5>
                     {template.content && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                           {template.content}
                        </p>
                     )}
                     {template.categories && template.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                           {map(template.categories, (cat) => (
                              <span
                                 key={cat.name}
                                 className="text-xs px-1.5 py-0.5 bg-white text-slate-600 rounded border border-slate-200"
                              >
                                 {cat.name}
                              </span>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      );
   };

   const renderSubscriptionDetails = () => {
      if (product.type !== "SUBSCRIPTION" || !product.subscriptionDuration)
         return null;

      const days = product.subscriptionDuration;
      const months = Math.floor(days / 30);

      return (
         <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
               <Calendar className="h-4 w-4" />
               Subscription Details
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
               <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-600">Duration</span>
                     <span className="text-sm font-medium text-slate-900">
                        {months > 0
                           ? `${months} month${months > 1 ? "s" : ""}`
                           : `${days} days`}
                     </span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-600">Access</span>
                     <span className="text-sm font-medium text-slate-900">
                        All templates
                     </span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-600">Renewal</span>
                     <span className="text-sm font-medium text-slate-900">
                        Manual
                     </span>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                     <DialogTitle className="text-2xl mb-2">
                        {product.name}
                     </DialogTitle>
                     <div className="flex items-center gap-2">
                        <Badge className={getTypeBadgeColor()}>
                           {product.type}
                        </Badge>
                        <span className="text-2xl font-bold text-indigo-600">
                           ${product.price.toFixed(2)}
                        </span>
                     </div>
                  </div>
               </div>
               <DialogDescription className="text-base mt-3">
                  {product.description}
               </DialogDescription>
            </DialogHeader>

            <Separator className="my-4" />

            <div className="space-y-6">
               {renderTemplateDetails()}
               {renderBundleDetails()}
               {renderSubscriptionDetails()}
            </div>

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t mt-6 -mx-6 px-6 py-4">
               <Button
                  onClick={handleAddToCart}
                  disabled={isPending}
                  className="flex-1"
                  size="lg"
               >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isPending ? "Adding..." : "Add to Cart"}
               </Button>
               <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  size="lg"
               >
                  Close
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
};
