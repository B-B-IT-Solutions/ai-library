import { isEmpty } from "es-toolkit/compat";

import { CartControls } from "@/components/cart/cart-controls";
import { Products } from "@/components/products/products";
import { DCart } from "@/data/types/domain/cart";
import { DProduct, DProductViewMode } from "@/data/types/domain/product";

type MarketplaceProps = {
   products: DProduct[];
   initialCart: DCart;
   viewMode?: DProductViewMode;
};

export const Marketplace = ({
   products,
   initialCart,
   viewMode,
}: MarketplaceProps) => {
   // Get IDs of products already in cart
   const cartProductIds = new Set(
      initialCart.items.map((item) => item.product.id)
   );

   const content = () => {
      if (isEmpty(products)) {
         return (
            <div className="text-center py-12" data-testid="products-empty">
               <p className="text-slate-600">
                  No products available at the moment.
               </p>
            </div>
         );
      }
      return (
         <>
            <Products
               products={products}
               cartProductIds={cartProductIds}
               viewMode={viewMode}
            />
            <CartControls initialCart={initialCart} />
         </>
      );
   };

   return <div data-testid="market-place">{content()}</div>;
};
