import {
   PageHeaderSkeleton,
   TemplateCardSkeleton,
} from "@/components/shared/skeletons";

export const LibraryLoading = () => {
   return (
      <div
         className="container mx-auto px-4 py-8"
         data-testid="library-loading"
      >
         <PageHeaderSkeleton />

         {/* Subscription Banner Skeleton */}
         <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
               <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-40" />
                  <div className="h-4 bg-slate-200 rounded w-64" />
               </div>
               <div className="h-6 bg-slate-200 rounded w-16" />
            </div>
         </div>

         {/* Templates Grid Skeleton */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
               <TemplateCardSkeleton key={i} />
            ))}
         </div>
      </div>
   );
};

export default LibraryLoading;
