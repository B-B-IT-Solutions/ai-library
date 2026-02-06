import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/products/buttons/add-to-cart-button";
import { ProductDetails } from "@/components/products/product/product-details";
import { ProductHeader } from "@/components/products/product/product-header";
import { Button } from "@/components/shadcn/button";
import { getCart } from "@/data/actions/cart";
import { getProduct } from "@/data/actions/product";

export const metadata: Metadata = {
   title: "Product",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

const PublicProductPage = async (props: PageProps) => {
   const { id: productId } = await props.params;

   // Fetch product and cart
   const [product, cart] = await Promise.all([
      getProduct(productId),
      getCart(),
   ]);

   if (!product) {
      return notFound();
   }

   // Check if product is in cart
   const isInCart = cart.items.some((item) => item.productId === product.id);

   return (
      <div
         className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5"
         data-testid="product-page"
      >
         <div className="container mx-auto max-w-6xl px-4 py-8">
            {/* Back button */}
            <div className="mb-6">
               <Button variant="ghost" asChild={true}>
                  <Link href="/p/marketplace" data-testid="marketplace-link-1">
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back to Marketplace
                  </Link>
               </Button>
            </div>

            {/* Product Header */}
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
               <ProductHeader product={product} />
            </div>

            {/* Product Content */}
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
               <ProductDetails product={product} />
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
               <div className="flex flex-col gap-3 sm:flex-row">
                  <AddToCartButton
                     product={product}
                     isInCart={isInCart}
                     size="lg"
                  />
                  <Button variant="outline" size="lg" asChild={true}>
                     <Link
                        href="/p/marketplace"
                        data-testid="marketplace-link-2"
                     >
                        Continue Shopping
                     </Link>
                  </Button>
                  <Button
                     variant="ghost"
                     size="lg"
                     asChild
                     className="sm:ml-auto"
                  >
                     <Link href="/auth/sign-in">Sign in for full access</Link>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PublicProductPage;
