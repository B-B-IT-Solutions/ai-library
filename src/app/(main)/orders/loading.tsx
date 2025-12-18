import {
   OrderCardSkeleton,
   PageHeaderSkeleton,
} from "@/components/shared/skeletons";

export const OrdersLoading = () => {
   return (
      <div className="container mx-auto px-4 py-8" data-testid="orders-loading">
         <PageHeaderSkeleton />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
               <OrderCardSkeleton key={i} />
            ))}
         </div>
      </div>
   );
};

export default OrdersLoading;
