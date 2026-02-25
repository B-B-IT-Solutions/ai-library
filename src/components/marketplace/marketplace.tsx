import { isEmpty } from "es-toolkit/compat";

import { CartControls } from "@/components/cart/cart-controls";
import { Products } from "@/components/products";
import { DCart } from "@/data/types/domain/cart";
import { DListViewMode } from "@/data/types/domain/common";
import { DProduct } from "@/data/types/domain/product";

type MarketplaceProps = {
   products: DProduct[];
   cart: DCart;
   viewMode?: DListViewMode;
};

export const Marketplace = ({ products, cart, viewMode }: MarketplaceProps) => {
   const content = () => {
      if (isEmpty(products)) {
         return (
            <div className="py-12 text-center" data-testid="products-empty">
               <p className="text-slate-600">
                  No products available at the moment.
               </p>
            </div>
         );
      }
      return (
         <>
            <Products products={products} cart={cart} viewMode={viewMode} />
            <CartControls cart={cart} />
         </>
      );
   };

   return <div data-testid="market-place">{content()}</div>;
};
