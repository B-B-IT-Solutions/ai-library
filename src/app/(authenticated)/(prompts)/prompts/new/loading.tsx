import { Skeleton } from "@/components/shadcn/skeleton";

export const NewPromptLoading = () => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-prompt-loading"
      >
         {/* Top Navigation Bar */}
         <div className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
               <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-96" />
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="mx-auto max-w-5xl p-8">
               <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="space-y-8">
                     {/* Basic Information */}
                     <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                     </div>

                     {/* Prompt Template */}
                     <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-32 w-full" />
                     </div>

                     {/* Template Fields */}
                     <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-48 w-full" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default NewPromptLoading;
