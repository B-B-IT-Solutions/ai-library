export default function CheckoutLoading() {
   return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
         <div className="h-8 bg-slate-200 rounded w-32 mb-8 animate-pulse" />

         <div className="space-y-6">
            {/* Order Summary Skeleton */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
               <div className="h-6 bg-slate-200 rounded w-40 mb-4 animate-pulse" />
               <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="flex justify-between">
                        <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
                     </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between">
                     <div className="h-6 bg-slate-200 rounded w-20 animate-pulse" />
                     <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />
                  </div>
               </div>
            </div>

            {/* Checkout Form Skeleton */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
               <div className="space-y-6">
                  <div className="space-y-4">
                     <div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
                     <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                     <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-40 animate-pulse" />
                        <div className="h-10 bg-slate-100 rounded w-full animate-pulse" />
                     </div>
                  </div>
                  <div className="border-t pt-4">
                     <div className="flex items-center gap-3">
                        <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />
                     </div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded w-full animate-pulse" />
               </div>
            </div>
         </div>
      </div>
   );
}
