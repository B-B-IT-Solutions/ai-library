import { Skeleton } from "@/components/shadcn/skeleton";

export const LoadingWorkflowData = () => (
   <div className="flex h-full flex-col" data-testid="loading-workflow-data">
      <div className="flex items-center justify-between border-b bg-background px-6 py-3">
         <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-5 w-px" />
            <Skeleton className="h-5 w-52" />
         </div>
         <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-2 border-b bg-muted/50 px-6 pt-2.5 pb-2">
         <Skeleton className="h-3 w-24" />
         <Skeleton className="h-1 w-full rounded-full" />
         <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="flex-1 p-6">
         <div className="mx-auto max-w-3xl space-y-5">
            <div className="space-y-3 rounded-xl border bg-card p-6">
               <Skeleton className="h-7 w-56" />
               <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-40 w-full rounded-xl" />
         </div>
      </div>
      <div className="space-y-3 border-t bg-background px-6 py-4">
         <Skeleton className="h-4 w-40" />
         <div className="flex gap-3">
            <Skeleton className="h-11 w-44 rounded-lg" />
            <Skeleton className="h-11 w-44 rounded-lg" />
         </div>
      </div>
   </div>
);
