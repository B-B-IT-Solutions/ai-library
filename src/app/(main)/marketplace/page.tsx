import { getCartSummary } from "@/data/actions/cart/cart.actions";
import { getProducts } from "@/data/actions/product/product.actions";

import { MarketplaceClient } from "./marketplace-client";

export default async function MarketplacePage() {
   // Fetch data on the server
   const [products, cart] = await Promise.all([
      getProducts(),
      getCartSummary(),
   ]);

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
               Marketplace
            </h1>
            <p className="text-slate-600">
               Browse and purchase prompt templates and bundles
            </p>
         </div>

         <MarketplaceClient products={products} initialCart={cart} />
      </div>
   );
}
