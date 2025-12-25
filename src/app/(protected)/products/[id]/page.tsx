import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
   AddToCartButton,
   ProductDetails,
   ProductHeader,
} from "@/components/products";
import { Button } from "@/components/shadcn/button";
import { getCart } from "@/data/actions/cart";
import { getBundleValue, getProduct } from "@/data/actions/product";

export const metadata: Metadata = {
   title: "Product",
};

export type ProductParams = {
   id: string;
};

export type ProductPageProps = {
   params: Promise<ProductParams>;
};

const ProductPage = async (props: ProductPageProps) => {
   const { id: productId } = await props.params;

   const [product, cart] = await Promise.all([
      getProduct(productId),
      getCart(),
   ]);

   if (!product) {
      return notFound();
   }

   const isInCart = cart.items.some((item) => item.productId === product.id);

   const bundleValue =
      product.type === "BUNDLE" ? await getBundleValue(product) : null;

   return (
      <div
         className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5"
         data-testid="product-page"
      >
         <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
               <Button variant="ghost" asChild>
                  <Link href="/marketplace" data-testid="marketplace-link-1">
                     <ArrowLeft className="h-4 w-4 mr-2" />
                     Back to Marketplace
                  </Link>
               </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
               <ProductHeader product={product} />
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
               <ProductDetails product={product} bundleValue={bundleValue} />
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
               <div className="flex gap-3">
                  <AddToCartButton
                     product={product}
                     isInCart={isInCart}
                     size="lg"
                  />
                  <Button variant="outline" size="lg" asChild>
                     <Link href="/marketplace" data-testid="marketplace-link-2">
                        Continue Shopping
                     </Link>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProductPage;
