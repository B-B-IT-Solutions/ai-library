import { map } from "es-toolkit/compat";

import { CartPreviewWrapper } from "@/components/cart/cart-preview-wrapper";
import { ProductCard } from "@/components/products/product-card";
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
   if (!products || products.length === 0) {
      return (
         <div className="text-center py-12">
            <p className="text-slate-600">
               No products available at the moment.
            </p>
         </div>
      );
   }

   return (
      <div className="flex flex-col lg:flex-row gap-8">
         {/* Products Grid */}
         <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {map(products, (product) => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>
         </div>

         {/* Cart Preview Sidebar */}
         <div className="w-full lg:w-80">
            <div className="sticky top-4">
               <CartPreviewWrapper initialCart={initialCart} />
            </div>
         </div>
      </div>
   );
};
