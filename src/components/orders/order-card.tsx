"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DOrder } from "@/data/types/domain/order";
import { formatDateTime } from "@/lib/utils";

type OrderCardProps = {
   order: DOrder;
};

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
   const router = useRouter();

   const statusBadge = () => {
      const colors = {
         PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
         COMPLETED: "bg-green-100 text-green-700 border-green-200",
         FAILED: "bg-red-100 text-red-700 border-red-200",
         REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",
      };

      return (
         <span
            className={`rounded border px-2 py-1 text-xs ${
               colors[order.status]
            }`}
         >
            {order.status}
         </span>
      );
   };

   const handleViewDetails = () => {
      router.push(`/orders/${order.id}`);
   };

   return (
      <Card
         className="gap-0 rounded-lg border border-slate-300 bg-white p-4 transition-all hover:border-blue-500"
         data-testid="order-card"
      >
         <CardHeader className="mb-3 gap-2 p-0">
            <div className="flex items-start justify-between gap-2">
               <div>
                  <p className="text-sm text-slate-600">
                     Order #{order.id.substring(0, 8)}...
                  </p>
                  <p className="text-xs text-slate-500">
                     {formatDateTime(order.createdAt).dateTime}
                  </p>
               </div>
               {statusBadge()}
            </div>
         </CardHeader>
         <CardContent className="space-y-3 p-0">
            <div className="flex justify-between text-sm">
               <span className="text-slate-600">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
               </span>
               <span className="font-bold text-slate-900">
                  ${order.totalAmount.toFixed(2)}
               </span>
            </div>

            <Button
               variant="outline"
               size="sm"
               onClick={handleViewDetails}
               className="w-full cursor-pointer"
               data-testid="view-details-button"
            >
               View Details
            </Button>
         </CardContent>
      </Card>
   );
};
