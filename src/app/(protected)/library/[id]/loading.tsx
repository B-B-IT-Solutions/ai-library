export const LibraryDetailLoading = () => {
   return (
      <div className="container mx-auto px-4 py-8">
         {/* Back Button Skeleton */}
         <div className="mb-6">
            <div className="h-5 bg-slate-200 rounded w-48 animate-pulse" />
         </div>

         <div className="max-w-4xl mx-auto">
            {/* Card Skeleton */}
            <div className="bg-white border border-slate-300 rounded-lg">
               {/* Header Skeleton */}
               <div className="p-6 border-b border-slate-200">
                  <div className="space-y-4">
                     {/* Title */}
                     <div className="h-9 bg-slate-200 rounded w-3/4 animate-pulse" />

                     {/* Recommended Model Badge */}
                     <div className="h-7 bg-slate-200 rounded w-32 animate-pulse" />

                     {/* Categories */}
                     <div className="flex flex-wrap gap-2">
                        {[1, 2, 3].map((i) => (
                           <div
                              key={i}
                              className="h-6 bg-slate-100 rounded w-20 animate-pulse"
                           />
                        ))}
                     </div>
                  </div>
               </div>

               {/* Content Skeleton */}
               <div className="p-6 space-y-6">
                  {/* Description Section */}
                  <div>
                     <div className="h-7 bg-slate-200 rounded w-32 mb-3 animate-pulse" />
                     <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-4/5 animate-pulse" />
                     </div>
                  </div>

                  {/* Detailed Description Section */}
                  <div>
                     <div className="h-7 bg-slate-200 rounded w-48 mb-3 animate-pulse" />
                     <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-4/5 animate-pulse" />
                        <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                     </div>
                  </div>

                  {/* Prompt Text Section */}
                  <div>
                     <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 animate-pulse">
                        <div className="flex items-center justify-between mb-3">
                           <div className="h-6 bg-slate-200 rounded w-28" />
                           <div className="h-8 bg-slate-200 rounded w-24" />
                        </div>
                        <div className="space-y-2">
                           <div className="h-4 bg-slate-100 rounded w-full" />
                           <div className="h-4 bg-slate-100 rounded w-full" />
                           <div className="h-4 bg-slate-100 rounded w-5/6" />
                           <div className="h-4 bg-slate-100 rounded w-4/5" />
                           <div className="h-4 bg-slate-100 rounded w-full" />
                           <div className="h-4 bg-slate-100 rounded w-3/4" />
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                     <div className="h-10 bg-slate-200 rounded w-40 animate-pulse" />
                     <div className="h-10 bg-slate-200 rounded w-32 animate-pulse" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LibraryDetailLoading;
