import { PricingPlans } from "@/components/settings";
import { getSubscriptionPlans } from "@/data/actions/subscription";

export const TrialExpiredGate = async () => {
   const plans = await getSubscriptionPlans();

   return (
      <div
         className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16"
         data-testid="trial-expired-gate"
      >
         <div className="mb-12 max-w-2xl text-center">
            <h1 className="mb-4 text-4xl font-bold">
               Deine kostenlose Testphase ist abgelaufen
            </h1>
            <p className="text-xl text-muted-foreground">
               Wähle einen Plan um weiterzumachen.
            </p>
         </div>

         <PricingPlans plans={plans} currentSubscription={null} />
      </div>
   );
};
