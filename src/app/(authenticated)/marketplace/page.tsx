import { Metadata } from "next";

import { Marketplace } from "@/components/marketplace";
import { getCart } from "@/data/actions/cart";
import { getProducts } from "@/data/actions/product";
import { DProductViewMode } from "@/data/types/domain/product";

export const metadata: Metadata = {
   title: "Marktplatz",
};

export type MarketPlaceSearchParams = { view?: DProductViewMode };

export type MarketplacePageProps = {
   searchParams?: Promise<MarketPlaceSearchParams>;
};

export const MarketplacePage = async (props: MarketplacePageProps) => {
   const searchParams = await props.searchParams;
   const viewMode = searchParams?.view;

   const [products, cart] = await Promise.all([getProducts(), getCart()]);

   return (
      <div
         className="container mx-auto px-4 py-8"
         data-testid="market-place-page"
      >
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
               Marktplatz
            </h1>
            <p className="text-slate-600">
               Durchsuchen und kaufen Sie Prompt-Vorlagen und Bundles
            </p>
         </div>
         <Marketplace products={products} cart={cart} viewMode={viewMode} />
      </div>
   );
};

export default MarketplacePage;
