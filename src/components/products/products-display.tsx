"use client";

import { useState } from "react";
import { map } from "es-toolkit/compat";

import { DProduct } from "@/data/types/domain/product";

import { ProductCard } from "./product-card";
import { ProductListItem } from "./product-list-item";
import { ViewMode, ViewToggle } from "./view-toggle";

type ProductsDisplayProps = {
   products: DProduct[];
   cartProductIds: Set<string>;
};

export const ProductsDisplay = ({
   products,
   cartProductIds,
}: ProductsDisplayProps) => {
   const [viewMode, setViewMode] = useState<ViewMode>("grid");

   return (
      <div data-testid="products">
         {/* View Toggle */}
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
               {products.length}{" "}
               {products.length === 1 ? "Product" : "Products"}
            </h2>
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
         </div>

         {/* Products Display */}
         {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {map(products, (product) => (
                  <ProductCard
                     key={product.id}
                     product={product}
                     isInCart={cartProductIds.has(product.id)}
                  />
               ))}
            </div>
         ) : (
            <div className="space-y-4">
               {map(products, (product) => (
                  <ProductListItem
                     key={product.id}
                     product={product}
                     isInCart={cartProductIds.has(product.id)}
                  />
               ))}
            </div>
         )}
      </div>
   );
};
