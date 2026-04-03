export const TemplateDetailLoading = () => {
   return (
      <div
         className="container mx-auto px-4 py-8"
         data-testid="template-loading"
      >
         {/* Back Button Skeleton */}
         <div className="mb-6">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
         </div>

         <div className="mx-auto max-w-5xl">
            {/* Card Skeleton */}
            <div className="rounded-lg border border-slate-300 bg-white">
               {/* Header Skeleton */}
               <div className="border-b border-slate-200 p-6">
                  <div className="space-y-4">
                     {/* Title */}
                     <div className="h-9 w-3/4 animate-pulse rounded bg-slate-200" />

                     {/* Recommended Model Badge */}
                     <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />

                     {/* Categories */}
                     <div className="flex flex-wrap gap-2">
                        {[1, 2, 3].map((i) => (
                           <div
                              key={i}
                              className="h-6 w-20 animate-pulse rounded bg-slate-100"
                           />
                        ))}
                     </div>
                  </div>
               </div>

               {/* Content Skeleton */}
               <div className="space-y-6 p-6">
                  {/* Description Section */}
                  <div>
                     <div className="mb-3 h-7 w-32 animate-pulse rounded bg-slate-200" />
                     <div className="space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                     </div>
                  </div>

                  {/* Detailed Description Section */}
                  <div>
                     <div className="mb-3 h-7 w-48 animate-pulse rounded bg-slate-200" />
                     <div className="space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                     </div>
                  </div>

                  {/* Prompt Text Section */}
                  <div>
                     <div className="animate-pulse rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                           <div className="h-6 w-28 rounded bg-slate-200" />
                           <div className="h-8 w-24 rounded bg-slate-200" />
                        </div>
                        <div className="space-y-2">
                           <div className="h-4 w-full rounded bg-slate-100" />
                           <div className="h-4 w-full rounded bg-slate-100" />
                           <div className="h-4 w-5/6 rounded bg-slate-100" />
                           <div className="h-4 w-4/5 rounded bg-slate-100" />
                           <div className="h-4 w-full rounded bg-slate-100" />
                           <div className="h-4 w-3/4 rounded bg-slate-100" />
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="flex gap-3 border-t border-slate-200 pt-4">
                     <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
                     <div className="h-10 w-32 animate-pulse rounded bg-slate-200" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TemplateDetailLoading;
