import { map } from "es-toolkit/compat";

import { ListViewToggle } from "@/components/shared/buttons";
import { DCart } from "@/data/types/domain/cart";
import { DListViewMode } from "@/data/types/domain/common";
import { DProduct } from "@/data/types/domain/product";

import { ProductCard } from "./list/product-card";
import { ProductListItem } from "./list/product-list-item";

type ProductsProps = {
   products: DProduct[];
   cart: DCart;
   viewMode?: DListViewMode;
};

export const Products = ({
   products,
   cart,
   viewMode = DListViewMode.GRID,
}: ProductsProps) => {
   const cartProductIds = new Set(cart.items.map((item) => item.productId));

   const gridView = () => {
      return (
         <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            data-testid="products-grid"
         >
            {map(products, (product) => (
               <ProductCard
                  key={product.id}
                  product={product}
                  isInCart={cartProductIds.has(product.id)}
               />
            ))}
         </div>
      );
   };

   const listView = () => {
      return (
         <div className="space-y-4" data-testid="products-list">
            {map(products, (product) => (
               <ProductListItem
                  key={product.id}
                  product={product}
                  isInCart={cartProductIds.has(product.id)}
               />
            ))}
         </div>
      );
   };

   const view = () => {
      if (viewMode === "grid") {
         return gridView();
      }
      return listView();
   };

   return (
      <div data-testid="products">
         <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
               {products.length}{" "}
               {products.length === 1 ? "Produkt" : "Produkte"}
            </h2>
            <ListViewToggle currentView={viewMode} />
         </div>
         {view()}
      </div>
   );
};
