import { isEmpty } from "es-toolkit/compat";

import { CartControls } from "@/components/cart/cart-controls";
import { ProductsDisplay } from "@/components/products/products-display";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";

type MarketplaceClientProps = {
   products: DProduct[];
   initialCart: DCart;
};

export const MarketplaceClient = ({
   products,
   initialCart,
}: MarketplaceClientProps) => {
   if (isEmpty(products)) {
      return (
         <div className="text-center py-12">
            <p className="text-slate-600">
               No products available at the moment.
            </p>
         </div>
      );
   }

   // Get IDs of products already in cart
   const cartProductIds = new Set(
      initialCart.items.map((item) => item.product.id)
   );

   return (
      <div data-testid="market-place-client">
         <ProductsDisplay products={products} cartProductIds={cartProductIds} />
         <CartControls initialCart={initialCart} />
      </div>
   );
};
