import {
   CartPreviewSkeleton,
   PageHeaderSkeleton,
   ProductCardSkeleton,
} from "@/components/shared/skeletons";

export default function MarketplaceLoading() {
   return (
      <div className="container mx-auto px-4 py-8">
         <PageHeaderSkeleton />

         <div className="flex flex-col lg:flex-row gap-8">
            {/* Products Grid Skeleton */}
            <div className="flex-1">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                     <ProductCardSkeleton key={i} />
                  ))}
               </div>
            </div>

            {/* Cart Preview Skeleton */}
            <div className="w-full lg:w-80">
               <div className="sticky top-4">
                  <CartPreviewSkeleton />
               </div>
            </div>
         </div>
      </div>
   );
}
