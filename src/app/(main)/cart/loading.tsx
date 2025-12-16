import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { CartItemSkeleton } from "@/components/shared/skeletons";

export default function CartLoading() {
   return (
      <div className="container mx-auto px-4 py-8">
         <div className="h-8 bg-slate-200 rounded w-48 mb-8 animate-pulse" />

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2 space-y-4">
               {[1, 2, 3].map((i) => (
                  <CartItemSkeleton key={i} />
               ))}
               <div className="h-10 bg-slate-200 rounded w-full animate-pulse" />
            </div>

            {/* Cart Summary Skeleton */}
            <div>
               <Card className="p-4">
                  <CardHeader className="p-0 mb-4">
                     <div className="h-6 bg-slate-200 rounded w-32 animate-pulse" />
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                     <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                     </div>
                     <div className="border-t pt-3">
                        <div className="h-6 bg-slate-200 rounded w-full animate-pulse" />
                     </div>
                     <div className="h-10 bg-slate-200 rounded w-full animate-pulse" />
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
