import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/products/buttons/add-to-cart-button";
import { ProductDetailsContent } from "@/components/products/product/product-details-content";
import { ProductPageHeader } from "@/components/products/product/product-page-header";
import { parseProductContent } from "@/components/products/product/product-details-dialog/utils/content-parser";
import { Button } from "@/components/shadcn/button";
import { getCart } from "@/data/actions/cart";
import { getBundleValue, getProducts } from "@/data/actions/product";

export const metadata: Metadata = {
   title: "Product Details",
};

export type ProductPageProps = {
   params: Promise<{ id: string }>;
};

const ProductPage = async (props: ProductPageProps) => {
   const { id } = await props.params;

   // Fetch product and cart
   const [products, cart] = await Promise.all([getProducts(), getCart()]);

   const product = products.find((p) => p.id === id);

   if (!product) {
      notFound();
   }

   // Check if product is in cart
   const isInCart = cart.items.some((item) => item.productId === product.id);

   // Parse content
   const parsedContent =
      product.type === "TEMPLATE" && product.template
         ? parseProductContent(
              product.template.content,
              product.template.categories.map((c) => c.name)
           )
         : product.type === "BUNDLE" && product.bundleItems
         ? parseProductContent(
              product.bundleItems
                 .map((item) => item.template?.content || "")
                 .join("\n\n"),
              Array.from(
                 new Set(
                    product.bundleItems.flatMap(
                       (item) =>
                          item.template?.categories.map((c) => c.name) || []
                    )
                 )
              )
           )
         : {
              features: [],
              useCases: [],
              examples: [],
              instructions: [],
              placeholders: [],
           };

   // Calculate bundle value if needed
   const bundleValue =
      product.type === "BUNDLE" ? await getBundleValue(product) : null;

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
         <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Back button */}
            <div className="mb-6">
               <Button variant="ghost" asChild>
                  <Link href="/marketplace">
                     <ArrowLeft className="h-4 w-4 mr-2" />
                     Back to Marketplace
                  </Link>
               </Button>
            </div>

            {/* Product Header */}
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
               <ProductPageHeader product={product} />
            </div>

            {/* Product Content */}
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
               <ProductDetailsContent
                  product={product}
                  parsedContent={parsedContent}
                  bundleValue={bundleValue}
               />
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
               <div className="flex gap-3">
                  <AddToCartButton
                     product={product}
                     isInCart={isInCart}
                     size="lg"
                  />
                  <Button variant="outline" size="lg" asChild>
                     <Link href="/marketplace">Continue Shopping</Link>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProductPage;
