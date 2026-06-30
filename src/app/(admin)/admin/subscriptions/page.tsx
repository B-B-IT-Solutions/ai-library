import { Metadata } from "next";

import { AdminSubscriptionsTable } from "@/components/admin/subscriptions";
import { getAdminSubscriptionsPage } from "@/data/actions/admin/subscription.admin.actions";

export const metadata: Metadata = { title: "Admin – Abonnements" };

const AdminSubscriptionsPage = async () => {
   const subscriptionsPage = await getAdminSubscriptionsPage();
   return (
      <div className="container mx-auto max-w-7xl px-4 py-8" data-testid="admin-subscriptions-page">
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Abonnements</h1>
            <p className="text-slate-600">{subscriptionsPage.totalElements} Abonnements gesamt</p>
         </div>
         <AdminSubscriptionsTable subscriptionsPage={subscriptionsPage} />
      </div>
   );
};

export default AdminSubscriptionsPage;
