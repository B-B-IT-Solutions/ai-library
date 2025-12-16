import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { map } from "es-toolkit/compat";

import { ProductCard } from "@/components/products/product-card";
import { preloadCartOptions } from "@/data/ts-queries/cart/cart";
import { preloadProductsOptions } from "@/data/ts-queries/product/product";

import { MarketplaceClient } from "./marketplace-client";

export default async function MarketplacePage() {
   const queryClient = new QueryClient();

   await Promise.all([
      queryClient.prefetchQuery(preloadProductsOptions()),
      queryClient.prefetchQuery(preloadCartOptions()),
   ]);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Marketplace
               </h1>
               <p className="text-slate-600">
                  Browse and purchase prompt templates, bundles, and
                  subscriptions
               </p>
            </div>

            <MarketplaceClient />
         </div>
      </HydrationBoundary>
   );
}
