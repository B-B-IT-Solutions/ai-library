import {
   CreditCard,
   FileText,
   ShoppingBag,
   TrendingUp,
   Users,
} from "lucide-react";

import { getAdminStats } from "@/data/actions/admin/dashboard";

import { KpiCard } from "./kpi-card";

export const AdminDashboard = async () => {
   const stats = await getAdminStats();

   return (
      <div
         className="container mx-auto max-w-7xl px-4 py-8"
         data-testid="admin-dashboard"
      >
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
               Admin Dashboard
            </h1>
            <p className="text-slate-600">Plattformübersicht</p>
         </div>
         <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
               <KpiCard
                  title="Gesamtnutzer"
                  value={stats.totalUsers}
                  subtitle={`+${stats.newUsersLast30Days} letzte 30 Tage`}
                  icon={Users}
               />
               <KpiCard
                  title="Aktive Abos"
                  value={
                     stats.activeSubscriptions.BASIC +
                     stats.activeSubscriptions.PRO
                  }
                  subtitle={`FREE: ${stats.activeSubscriptions.FREE} | BASIC: ${stats.activeSubscriptions.BASIC} | PRO: ${stats.activeSubscriptions.PRO}`}
                  icon={CreditCard}
               />
               <KpiCard
                  title="Umsatz (30 Tage)"
                  value={`CHF ${stats.revenueLastMonth.toFixed(2)}`}
                  subtitle="Abgeschlossene Bestellungen"
                  icon={TrendingUp}
               />
               <KpiCard
                  title="Ausstehende Bestellungen"
                  value={stats.pendingOrders}
                  subtitle="Status: PENDING"
                  icon={ShoppingBag}
               />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <KpiCard
                  title="Katalog-Einträge"
                  value={stats.publishedCatalogEntries}
                  subtitle={`${stats.draftCatalogEntries} in Draft`}
                  icon={FileText}
               />
            </div>
         </div>
      </div>
   );
};
