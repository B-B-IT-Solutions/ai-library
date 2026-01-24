import { FC } from "react";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";

export const ProductCardSkeleton: FC = () => (
   <Card className="gap-0 rounded-lg border border-slate-300 bg-white p-4">
      <CardHeader className="mb-3 gap-2 p-0">
         <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
         </div>
         <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
      </CardHeader>
      <CardContent className="grid gap-2 p-0">
         <div className="mb-2 flex gap-1">
            <div className="h-5 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
         </div>
         <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
         <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
         <div className="flex gap-2">
            <div className="h-9 flex-1 animate-pulse rounded bg-slate-200" />
            <div className="h-9 flex-1 animate-pulse rounded bg-slate-200" />
         </div>
      </CardContent>
   </Card>
);

export const OrderCardSkeleton: FC = () => (
   <div className="h-48 rounded-lg border border-slate-200 bg-slate-100 p-4">
      <div className="mb-3 flex items-start justify-between">
         <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
         </div>
         <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="space-y-2">
         <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
         <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-4 border-t pt-4">
         <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
      </div>
   </div>
);

export const TemplateCardSkeleton: FC = () => (
   <Card className="gap-0 rounded-lg border border-slate-300 bg-white p-4">
      <CardHeader className="mb-3 gap-2 p-0">
         <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
         <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
      </CardHeader>
      <CardContent className="grid gap-3 p-0">
         <div className="mb-2 flex gap-1">
            <div className="h-5 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
         </div>
         <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
         </div>
         <div className="mt-2 flex gap-2">
            <div className="h-8 flex-1 animate-pulse rounded bg-slate-200" />
            <div className="h-8 flex-1 animate-pulse rounded bg-slate-200" />
         </div>
      </CardContent>
   </Card>
);

export const CartItemSkeleton: FC = () => (
   <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
      <div className="flex-1 space-y-2">
         <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
         <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="flex items-center gap-2">
         <div className="h-9 w-9 animate-pulse rounded bg-slate-200" />
         <div className="h-5 w-8 animate-pulse rounded bg-slate-200" />
         <div className="h-9 w-9 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="w-24">
         <div className="h-6 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="h-9 w-9 animate-pulse rounded bg-slate-200" />
   </div>
);

export const PageHeaderSkeleton: FC = () => (
   <div className="mb-8">
      <div className="mb-2 h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-96 animate-pulse rounded bg-slate-200" />
   </div>
);
