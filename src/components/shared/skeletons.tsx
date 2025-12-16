import { FC } from "react";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";

export const ProductCardSkeleton: FC = () => (
   <Card className="p-4 gap-0 bg-white border border-slate-300 rounded-lg">
      <CardHeader className="p-0 gap-2 mb-3">
         <div className="flex items-start justify-between gap-2">
            <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
            <div className="h-5 bg-slate-200 rounded w-16 animate-pulse" />
         </div>
         <div className="h-8 bg-slate-200 rounded w-20 animate-pulse" />
      </CardHeader>
      <CardContent className="p-0 grid gap-2">
         <div className="flex gap-1 mb-2">
            <div className="h-5 bg-slate-100 rounded w-16 animate-pulse" />
            <div className="h-5 bg-slate-100 rounded w-20 animate-pulse" />
         </div>
         <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
         <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse mb-2" />
         <div className="flex gap-2">
            <div className="h-9 bg-slate-200 rounded flex-1 animate-pulse" />
            <div className="h-9 bg-slate-200 rounded flex-1 animate-pulse" />
         </div>
      </CardContent>
   </Card>
);

export const CartPreviewSkeleton: FC = () => (
   <Card className="shadow-lg">
      <CardHeader className="pb-3">
         <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
         </div>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="space-y-3">
            {[1, 2, 3].map((i) => (
               <div
                  key={i}
                  className="h-20 bg-slate-100 rounded-lg animate-pulse"
               />
            ))}
         </div>
         <div className="border-t pt-4 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-full animate-pulse" />
         </div>
         <div className="space-y-2 pt-2">
            <div className="h-10 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-8 bg-slate-200 rounded w-full animate-pulse" />
         </div>
      </CardContent>
   </Card>
);

export const OrderCardSkeleton: FC = () => (
   <div className="h-48 bg-slate-100 rounded-lg border border-slate-200 p-4">
      <div className="flex justify-between items-start mb-3">
         <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
         </div>
         <div className="h-6 bg-slate-200 rounded w-20 animate-pulse" />
      </div>
      <div className="space-y-2">
         <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
         <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
      </div>
      <div className="mt-4 pt-4 border-t">
         <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />
      </div>
   </div>
);

export const TemplateCardSkeleton: FC = () => (
   <Card className="p-4 gap-0 bg-white border border-slate-300 rounded-lg">
      <CardHeader className="p-0 gap-2 mb-3">
         <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
         <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
      </CardHeader>
      <CardContent className="p-0 grid gap-3">
         <div className="flex gap-1 mb-2">
            <div className="h-5 bg-slate-100 rounded w-16 animate-pulse" />
            <div className="h-5 bg-slate-100 rounded w-20 animate-pulse" />
         </div>
         <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
         </div>
         <div className="flex gap-2 mt-2">
            <div className="h-8 bg-slate-200 rounded flex-1 animate-pulse" />
            <div className="h-8 bg-slate-200 rounded flex-1 animate-pulse" />
         </div>
      </CardContent>
   </Card>
);

export const CartItemSkeleton: FC = () => (
   <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
      <div className="flex-1 space-y-2">
         <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
         <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
         <div className="h-9 w-9 bg-slate-200 rounded animate-pulse" />
         <div className="h-5 w-8 bg-slate-200 rounded animate-pulse" />
         <div className="h-9 w-9 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="w-24">
         <div className="h-6 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="h-9 w-9 bg-slate-200 rounded animate-pulse" />
   </div>
);

export const PageHeaderSkeleton: FC = () => (
   <div className="mb-8">
      <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse" />
      <div className="h-4 bg-slate-200 rounded w-96 animate-pulse" />
   </div>
);
