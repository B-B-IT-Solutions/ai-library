import { Metadata } from "next";

import { AdminSubscriptionPlans } from "@/components/admin/subscription-plans";

export const metadata: Metadata = { title: "Admin – Abo-Pläne" };

const AdminSubscriptionPlansPage = async () => {
   return (
      <div className="h-full" data-testid="admin-subscription-plans-page">
         <AdminSubscriptionPlans />
      </div>
   );
};

export default AdminSubscriptionPlansPage;
