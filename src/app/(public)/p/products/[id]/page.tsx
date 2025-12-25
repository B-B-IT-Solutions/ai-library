import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { AddToCartButton } from "@/components/products/buttons/add-to-cart-button";
import { ProductDetailsContent } from "@/components/products/product/product-details-content";
import { ProductPageHeader } from "@/components/products/product/product-page-header";
import { Button } from "@/components/shadcn/button";
import { getCart } from "@/data/actions/cart";
import { getBundleValue, getProduct } from "@/data/actions/product";

export const metadata: Metadata = {
   title: "Product Details",
};

export type PublicProductPageProps = {
   params: Promise<{ id: string }>;
};

const PublicProductPage = async (props: PublicProductPageProps) => {
   const session = await auth();
   const { id: productId } = await props.params;

   // Redirect authenticated users to protected version
   if (session?.user?.id) {
      return redirect(`/products/${productId}`);
   }

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

   // Calculate bundle value if needed
   const bundleValue =
      product.type === "BUNDLE" ? await getBundleValue(product) : null;

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
         <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Back button */}
            <div className="mb-6">
               <Button variant="ghost" asChild>
                  <Link href="/p/marketplace">
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
                  bundleValue={bundleValue}
               />
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
               <div className="flex flex-col sm:flex-row gap-3">
                  <AddToCartButton
                     product={product}
                     isInCart={isInCart}
                     size="lg"
                  />
                  <Button variant="outline" size="lg" asChild>
                     <Link href="/p/marketplace">Continue Shopping</Link>
                  </Button>
                  <Button
                     variant="ghost"
                     size="lg"
                     asChild
                     className="sm:ml-auto"
                  >
                     <Link href="/sign-in">Sign in for full access</Link>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PublicProductPage;
