export const OrderDetailLoading = () => {
   return (
      <div
         className="container mx-auto px-4 py-8 max-w-2xl"
         data-testid="order-detail-loading"
      >
         {/* Success Banner Skeleton */}
         <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 mb-6 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="flex-1 space-y-2">
               <div className="h-6 bg-slate-200 rounded w-48" />
               <div className="h-4 bg-slate-200 rounded w-96" />
            </div>
         </div>

         {/* Order Details Skeleton */}
         <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
               <div className="space-y-2">
                  <div className="h-7 bg-slate-200 rounded w-40 animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded w-64 animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded w-48 animate-pulse" />
               </div>
               <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />
            </div>

            <div className="border-t pt-4 space-y-3">
               <div className="h-5 bg-slate-200 rounded w-16 mb-2 animate-pulse" />
               {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between">
                        <div className="space-y-1">
                           <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
                           <div className="h-3 bg-slate-100 rounded w-32 animate-pulse" />
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                     </div>
                  </div>
               ))}
               <div className="border-t pt-3 flex justify-between">
                  <div className="h-6 bg-slate-200 rounded w-16 animate-pulse" />
                  <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />
               </div>
            </div>
         </div>

         {/* Action Buttons Skeleton */}
         <div className="flex gap-4">
            <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse" />
            <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse" />
         </div>
      </div>
   );
};

export default OrderDetailLoading;
