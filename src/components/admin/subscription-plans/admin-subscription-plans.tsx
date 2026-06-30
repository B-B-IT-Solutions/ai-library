import { getAdminSubscriptionPlans } from "@/data/actions/admin/subscription-plan.admin.actions";

import { AdminSubscriptionPlansEditor } from "./admin-subscription-plans-editor";

export const AdminSubscriptionPlans = async () => {
   const plans = await getAdminSubscriptionPlans();

   return (
      <div
         className="container mx-auto max-w-7xl px-4 py-8"
         data-testid="admin-subscription-plans"
      >
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Abo-Pläne</h1>
            <p className="text-slate-600">Konfiguriere die Abonnement-Pläne</p>
         </div>
         <AdminSubscriptionPlansEditor plans={plans} />
      </div>
   );
};
