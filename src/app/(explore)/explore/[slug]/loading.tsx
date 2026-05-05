import { Skeleton } from "@/components/shadcn/skeleton";

const ExploreEntryLoading = () => {
   return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
         {/* Back link skeleton */}
         <Skeleton className="mb-6 h-5 w-40" />

         <div className="mx-auto max-w-3xl space-y-8">
            {/* Header */}
            <div className="space-y-4">
               <div className="flex gap-2">
                  <Skeleton className="h-6 w-32 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
               </div>
               <Skeleton className="h-9 w-full" />
               <Skeleton className="h-5 w-5/6" />
               <Skeleton className="h-12 w-64" />
            </div>

            <Skeleton className="h-px w-full" />

            {/* Fields */}
            <div className="space-y-4">
               <Skeleton className="h-7 w-48" />
               {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-4 space-y-2">
                     <Skeleton className="h-5 w-32" />
                     <Skeleton className="h-4 w-64" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ExploreEntryLoading;
