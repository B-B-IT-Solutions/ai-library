import { isEmpty, map } from "es-toolkit/compat";
import { Package } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { OrderCard } from "@/components/orders/order-card";
import { Button } from "@/components/shadcn/button";
import { getOrders } from "@/data/actions/order";

export const metadata: Metadata = {
   title: "Bestellverlauf",
};

export const OrdersPage = async () => {
   const orders = await getOrders();

   if (isEmpty(orders)) {
      return (
         <div className="container mx-auto px-4 py-8" data-testid="order-page">
            <h1 className="mb-8 text-3xl font-bold text-slate-900">
               Bestellverlauf
            </h1>
            <div className="py-12 text-center" data-testid="orders-empty">
               <Package className="mx-auto mb-4 h-16 w-16 text-slate-300" />
               <h2 className="mb-2 text-xl font-semibold text-slate-900">
                  Noch keine Bestellungen
               </h2>
               <p className="mb-6 text-slate-600">
                  Beginnen Sie mit dem Einkaufen, um Ihre erste Bestellung zu
                  erstellen
               </p>
               <Link href="/marketplace" data-testid="market-place-link">
                  <Button>Marktplatz durchsuchen</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8" data-testid="order-page">
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
               Bestellverlauf
            </h1>
            <p className="text-slate-600">
               Zeigen Sie Ihre vergangenen Bestellungen an und verwalten Sie
               diese
            </p>
         </div>

         <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            data-testid="orders-cards"
         >
            {map(orders, (order) => (
               <OrderCard key={order.id} order={order} />
            ))}
         </div>
      </div>
   );
};

export default OrdersPage;
