import { auth } from "@/auth";
import { PricingPlans } from "@/components/settings/subscription/pricing-plans";
import {
   getSubscriptionPlans,
   getUserSubscription,
} from "@/data/actions/subscription";

export default async function PricingPage() {
   const session = await auth();

   const plansResult = await getSubscriptionPlans();

   if (!plansResult.success) {
      throw new Error(plansResult.message);
   }

   const currentSubscription = await getUserSubscription();

   return (
      <div className="container mx-auto px-4 py-16">
         <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
               Unlock the full potential of AI-powered prompts with our flexible
               subscription plans
            </p>
         </div>

         <PricingPlans
            plans={plansResult.data}
            currentSubscription={currentSubscription}
         />
      </div>
   );
}
