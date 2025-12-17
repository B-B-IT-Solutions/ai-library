import { Metadata } from "next";

import { getCart } from "@/data/actions/cart";
import { getProducts } from "@/data/actions/product";
import { DProductViewMode } from "@/data/types/domain/product";

import { Marketplace } from "./marketplace";

export const metadata: Metadata = {
   title: "Marketplace",
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
               Marketplace
            </h1>
            <p className="text-slate-600">
               Browse and purchase prompt templates and bundles
            </p>
         </div>
         <Marketplace products={products} cart={cart} viewMode={viewMode} />
      </div>
   );
};

export default MarketplacePage;
