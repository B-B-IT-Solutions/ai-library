import { range } from "es-toolkit/compat";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import { DListViewMode } from "@/data/types/domain/common";

const PromptItemSkeleton = () => (
   <Card className="gap-0 rounded-lg border border-slate-300 bg-white p-0">
      <CardHeader className="gap-3 border-b border-slate-200 p-5 pb-3">
         <Skeleton className="h-6 w-3/4" />
         <Skeleton className="h-6 w-20 rounded-md" />
      </CardHeader>
      <CardContent className="grid gap-3 p-5">
         <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
         </div>
         <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
         </div>
         <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-9" />
         </div>
      </CardContent>
   </Card>
);

type Props = {
   viewMode: DListViewMode;
   count?: number;
};

export const PromptItemsSkeleton = ({ viewMode, count = 8 }: Props) => {
   const cards = range(count).map((i) => <PromptItemSkeleton key={i} />);

   if (viewMode === DListViewMode.LIST) {
      return (
         <div className="space-y-4" data-testid="prompt-items-skeleton">
            {cards}
         </div>
      );
   }

   return (
      <div
         className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
         data-testid="prompt-items-skeleton"
      >
         {cards}
      </div>
   );
};
