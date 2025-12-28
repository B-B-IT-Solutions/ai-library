"use client";

import { FC } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DOrder } from "@/data/types/domain/order";

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
            className={`text-xs px-2 py-1 rounded border ${
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
         className="p-4 gap-0 bg-white border border-slate-300 rounded-lg hover:border-blue-500 transition-all"
         data-testid="order-card"
      >
         <CardHeader className="p-0 gap-2 mb-3">
            <div className="flex items-start justify-between gap-2">
               <div>
                  <p className="text-sm text-slate-600">
                     Order #{order.id.substring(0, 8)}...
                  </p>
                  <p className="text-xs text-slate-500">
                     {format(new Date(order.createdAt), "PPP")}
                  </p>
               </div>
               {statusBadge()}
            </div>
         </CardHeader>
         <CardContent className="p-0 space-y-3">
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
