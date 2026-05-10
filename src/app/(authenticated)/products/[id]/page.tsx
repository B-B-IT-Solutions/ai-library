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
import { getProduct } from "@/data/actions/product";

export const metadata: Metadata = {
   title: "Produkt",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

const ProductPage = async (props: PageProps) => {
   const { id: productId } = await props.params;

   const [product, cart] = await Promise.all([
      getProduct(productId),
      getCart(),
   ]);

   if (!product) {
      return notFound();
   }

   const isInCart = cart.items.some((item) => item.productId === product.id);

   return (
      <div
         className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5"
         data-testid="product-page"
      >
         <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
               <Button variant="ghost" asChild={true}>
                  <Link href="/marketplace" data-testid="marketplace-link-1">
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back to Marketplace
                  </Link>
               </Button>
            </div>

            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
               <ProductHeader product={product} />
            </div>

            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
               <ProductDetails product={product} />
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
               <div className="flex gap-3">
                  <AddToCartButton
                     product={product}
                     isInCart={isInCart}
                     size="lg"
                  />
                  <Button variant="outline" size="lg" asChild={true}>
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
