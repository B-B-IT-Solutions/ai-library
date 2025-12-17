import { map } from "es-toolkit/compat";

import { DCart } from "@/data/types/domain/cart";
import { DProduct, DProductViewMode } from "@/data/types/domain/product";

import { ProductCard } from "./product-card";
import { ProductListItem } from "./product-list-item";
import { ViewToggle } from "./view-toggle";

type ProductsProps = {
   products: DProduct[];
   cart: DCart;
   viewMode?: DProductViewMode;
};

export const Products = ({
   products,
   cart,
   viewMode = "grid",
}: ProductsProps) => {
   const cartProductIds = new Set(cart.items.map((item) => item.product.id));

   const gridView = () => {
      return (
         <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
               {products.length}{" "}
               {products.length === 1 ? "Product" : "Products"}
            </h2>
            <ViewToggle currentView={viewMode} />
         </div>
         {view()}
      </div>
   );
};
