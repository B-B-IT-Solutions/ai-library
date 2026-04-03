import {
   PageHeaderSkeleton,
   TemplateCardSkeleton,
} from "@/components/shared/skeletons";

export const TemplatesLoading = () => {
   return (
      <div
         className="container mx-auto px-4 py-8"
         data-testid="templates-loading"
      >
         <PageHeaderSkeleton />

         {/* Subscription Banner Skeleton */}
         <div className="mb-6 animate-pulse rounded-lg border border-slate-200 bg-slate-100 p-4">
            <div className="flex items-center justify-between">
               <div className="space-y-2">
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="h-4 w-64 rounded bg-slate-200" />
               </div>
               <div className="h-6 w-16 rounded bg-slate-200" />
            </div>
         </div>

         {/* Templates Grid Skeleton */}
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
               <TemplateCardSkeleton key={i} />
            ))}
         </div>
      </div>
   );
};

export default TemplatesLoading;
