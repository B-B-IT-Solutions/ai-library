import { Metadata } from "next";

import { ChooseFreePlanButton } from "@/components/subscription/buttons/choose-free-plan-button";
import { PricingPlans } from "@/components/settings";
import {
   getSubscription,
   getSubscriptionPlans,
} from "@/data/actions/subscription";

export const metadata: Metadata = {
   title: "Preise",
};

const PricingPage = async () => {
   const plans = await getSubscriptionPlans();
   const subscription = await getSubscription();

   // No paid subscription → user is on trial or FREE.
   // Allow them to explicitly choose FREE (sets planChosenAt, closes the trial gate).
   // Users with a paid subscription who want FREE must cancel via Settings.
   const freeAction = !subscription ? <ChooseFreePlanButton /> : undefined;

   return (
      <div className="container mx-auto px-4 py-16" data-testid="pricing-page">
         <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Plan wählen</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
               Nutze das volle Potential KI-gestützter Prompts mit unseren
               flexiblen Abonnement-Plänen
            </p>
         </div>
         <PricingPlans
            plans={plans}
            currentSubscription={subscription}
            freeAction={freeAction}
         />
      </div>
   );
};

export default PricingPage;
