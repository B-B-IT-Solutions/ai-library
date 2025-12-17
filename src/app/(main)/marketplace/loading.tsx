import {
   PageHeaderSkeleton,
   ProductCardSkeleton,
} from "@/components/shared/skeletons";

export const MarketplaceLoading = () => {
   return (
      <div
         className="container mx-auto px-4 py-8"
         data-testid="market-place-loading"
      >
         <PageHeaderSkeleton />

         <div className="flex flex-col lg:flex-row gap-8">
            {/* Products Grid Skeleton */}
            <div className="flex-1">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                     <ProductCardSkeleton key={i} />
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default MarketplaceLoading;
