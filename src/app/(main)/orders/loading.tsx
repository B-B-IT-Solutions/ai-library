import {
   OrderCardSkeleton,
   PageHeaderSkeleton,
} from "@/components/shared/skeletons";

export default function OrdersLoading() {
   return (
      <div className="container mx-auto px-4 py-8">
         <PageHeaderSkeleton />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
               <OrderCardSkeleton key={i} />
            ))}
         </div>
      </div>
   );
}
