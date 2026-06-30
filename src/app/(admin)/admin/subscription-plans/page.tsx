import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSubscriptionPlansEditor } from "@/components/admin/subscription-plans";
import prisma from "@/data/repositories/prisma";
import { toDSubscriptionPlans } from "@/data/repositories/subscription/subscription.mapper";

export const metadata: Metadata = { title: "Admin – Abo-Pläne" };

const AdminSubscriptionPlansPage = async () => {
   const session = await auth();
   if (session?.user?.role !== "admin") return redirect("/");

   const rawPlans = await prisma.subscriptionPlan.findMany({ orderBy: { monthlyPrice: "asc" } });
   const plans = toDSubscriptionPlans(rawPlans);

   return (
      <div className="container mx-auto max-w-7xl px-4 py-8" data-testid="admin-subscription-plans-page">
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Abo-Pläne</h1>
            <p className="text-slate-600">Konfiguriere die Abonnement-Pläne</p>
         </div>
         <AdminSubscriptionPlansEditor plans={plans} />
      </div>
   );
};

export default AdminSubscriptionPlansPage;
