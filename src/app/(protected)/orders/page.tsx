import { isEmpty, map } from "es-toolkit/compat";
import { Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { OrderCard } from "@/components/orders/order-card";
import { Button } from "@/components/shadcn/button";
import { getOrders } from "@/data/actions/order/order.actions";

export const OrdersPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const orders = await getOrders();

   if (isEmpty(orders)) {
      return (
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
               Order History
            </h1>
            <div className="text-center py-12">
               <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  No orders yet
               </h2>
               <p className="text-slate-600 mb-6">
                  Start shopping to create your first order
               </p>
               <Link href="/marketplace">
                  <Button>Browse Marketplace</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
               Order History
            </h1>
            <p className="text-slate-600">View and manage your past orders</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {map(orders, (order) => (
               <OrderCard key={order.id} order={order} />
            ))}
         </div>
      </div>
   );
};

export default OrdersPage;
