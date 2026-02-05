import { format } from "date-fns";
import { map } from "es-toolkit/compat";
import { CheckCircle, Package } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { getOrder } from "@/data/actions/order";

export const metadata: Metadata = {
   title: "Order",
};

export type OrderParams = {
   id: string;
};

export type OrderDetailPageProps = {
   params: Promise<OrderParams>;
};

export const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
   const { id: orderId } = await params;
   const order = await getOrder(orderId);

   if (!order) {
      return (
         <div
            className="container mx-auto max-w-2xl px-4 py-8"
            data-testid="order-details-page"
         >
            <div className="py-12 text-center" data-testid="order-not-found">
               <Package className="mx-auto mb-4 h-16 w-16 text-slate-300" />
               <h2 className="mb-2 text-xl font-semibold text-slate-900">
                  Order not found
               </h2>
               <p className="mb-6 text-slate-600">
                  The order you're looking for doesn't exist or you don't have
                  access to it.
               </p>
               <Link href="/orders" data-testid="orders-link">
                  <Button>View All Orders</Button>
               </Link>
            </div>
         </div>
      );
   }

   const statusBadge = () => {
      const colors = {
         PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
         COMPLETED: "bg-green-100 text-green-700 border-green-200",
         FAILED: "bg-red-100 text-red-700 border-red-200",
         REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",
      };

      return (
         <span
            className={`rounded border px-3 py-1 text-sm ${
               colors[order.status]
            }`}
         >
            {order.status}
         </span>
      );
   };

   return (
      <div
         className="container mx-auto max-w-2xl px-4 py-8"
         data-testid="order-details-page"
      >
         {order.status === "COMPLETED" && (
            <div
               className="mb-6 flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-6"
               data-testid="order-status"
            >
               <CheckCircle className="h-12 w-12 text-green-600" />
               <div>
                  <h2 className="mb-1 text-xl font-semibold text-green-900">
                     Order Successful!
                  </h2>
                  <p className="text-green-700">
                     Your order has been completed and your templates are ready
                     in your library.
                  </p>
               </div>
            </div>
         )}

         <div
            className="mb-6 rounded-lg border border-slate-200 bg-white p-6"
            data-testid="order-details"
         >
            <div className="mb-4 flex items-start justify-between">
               <div>
                  <h1 className="mb-1 text-2xl font-bold text-slate-900">
                     Order Details
                  </h1>
                  <p className="text-sm text-slate-600">Order ID: {order.id}</p>
                  <p className="text-sm text-slate-600">
                     Date: {format(new Date(order.createdAt), "PPP")}
                  </p>
               </div>
               {statusBadge()}
            </div>

            <div className="space-y-3 border-t pt-4">
               <h3 className="mb-2 font-semibold">Items</h3>
               {map(order.items, (item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                     <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-slate-600">
                           {item.productType} · CHF {item.price}
                        </p>
                     </div>
                     <span className="font-medium">CHF {item.price}</span>
                  </div>
               ))}

               <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span>CHF {order.totalAmount}</span>
               </div>
            </div>
         </div>

         <div className="flex gap-4">
            <Link href="/library" className="flex-1" data-testid="library-link">
               <Button className="w-full cursor-pointer">Go to Library</Button>
            </Link>
            <Link href="/orders" className="flex-1" data-testid="orders-link">
               <Button variant="outline" className="w-full cursor-pointer">
                  View All Orders
               </Button>
            </Link>
         </div>
      </div>
   );
};

export default OrderDetailPage;
