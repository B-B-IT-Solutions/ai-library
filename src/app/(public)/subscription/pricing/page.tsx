import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  getUserSubscription,
  getSubscriptionPlans,
} from "@/data/actions/subscription";
import { PricingPlans } from "@/components/subscription/pricing-plans";

export default async function PricingPage() {
  const session = await auth();

  const plansResult = await getSubscriptionPlans();

  if (!plansResult.success) {
    throw new Error(plansResult.error);
  }

  let currentSubscription = null;
  if (session?.user?.id) {
    const subResult = await getUserSubscription();
    if (subResult.success) {
      currentSubscription = subResult.data;
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
