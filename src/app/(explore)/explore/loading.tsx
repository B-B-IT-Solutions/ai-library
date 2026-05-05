import { Skeleton } from "@/components/shadcn/skeleton";

export const ExplorePageLoading = () => {
   return (
      <div
         className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
         data-testid="explore-page-loading"
      >
         {/* Hero skeleton */}
         <div className="mb-8 flex flex-col items-center gap-3">
            <Skeleton className="h-10 w-96 max-w-full" />
            <Skeleton className="h-5 w-80 max-w-full" />
            <Skeleton className="h-5 w-72 max-w-full" />
         </div>

         {/* Filter bar skeleton */}
         <div className="mb-6 space-y-4">
            <div className="flex gap-3">
               <Skeleton className="h-10 flex-1" />
               <Skeleton className="h-10 w-44" />
            </div>
            <div className="flex gap-2">
               {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-28 rounded-full" />
               ))}
            </div>
         </div>

         {/* Grid skeleton */}
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
               <div
                  key={i}
                  className="space-y-3 rounded-xl border bg-white p-5"
               >
                  <div className="flex gap-2">
                     <Skeleton className="h-5 w-24 rounded-full" />
                     <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-4 h-9 w-full" />
               </div>
            ))}
         </div>
      </div>
   );
};

export default ExplorePageLoading;
