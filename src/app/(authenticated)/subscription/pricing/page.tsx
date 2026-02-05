import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PricingPlans } from "@/components/settings";
import {
   getSubscription,
   getSubscriptionPlans,
} from "@/data/actions/subscription";

export const metadata: Metadata = {
   title: "Priese",
};

const PricingPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const plans = await getSubscriptionPlans();

   const currentSubscription = await getSubscription();

   return (
      <div className="container mx-auto px-4 py-16" data-testid="pricing-page">
         <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
               Unlock the full potential of AI-powered prompts with our flexible
               subscription plans
            </p>
         </div>
         <PricingPlans
            plans={plans}
            currentSubscription={currentSubscription}
         />
      </div>
   );
};

export default PricingPage;
