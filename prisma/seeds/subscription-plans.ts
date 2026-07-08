import { PrismaClient } from "@prisma/client";

import { Prisma } from "@/generated/prisma/client";

const subscriptionPlans: Prisma.SubscriptionPlanCreateInput[] = [
   {
      tier: "FREE",
      name: "Free",
      description: "Mit den Grundfunktionen starten",
      monthlyPrice: 0,
      yearlyPrice: 0,
      stripePriceIdMonthly: null,
      stripePriceIdYearly: null,
      stripeProductId: null,
      features: {
         maxPrompts: 20,
         maxCollections: 3,
         maxPromptVariables: -1,
         maxGlobalPromptVariables: 5,
         canAccessPromptTemplatingEditor: true,
         canAccessDirectOpenInAiTool: true,
         canExportPrompts: true,
         canShareCollections: false,
         canUseAdvancedFeatures: false,
      },
      isActive: true,
   },
   {
      tier: "BASIC",
      name: "Basic",
      description: "Ideal für erfahrene Anwender",
      monthlyPrice: 4.99,
      yearlyPrice: 49.99,
      // stripePriceIdMonthly: null, // To be updated with actual Stripe price ID
      // stripePriceIdYearly: null, // To be updated with actual Stripe price ID
      // stripeProductId: null, // To be updated with actual Stripe product ID
      stripePriceIdMonthly: "price_1TZ9wpGzyOS6MDj9QJUsDzWf",
      stripePriceIdYearly: "price_1TZ9y2GzyOS6MDj9y1dhDXFN",
      stripeProductId: "prod_Qzbijhak3aLOfT",
      features: {
         maxPrompts: 100,
         maxCollections: 25,
         maxPromptVariables: -1,
         maxGlobalPromptVariables: -1,
         canAccessPromptTemplatingEditor: true,
         canAccessDirectOpenInAiTool: true,
         canExportPrompts: true,
         canShareCollections: false,
         canUseAdvancedFeatures: false,
      },
      isActive: true,
   },
   {
      tier: "PRO",
      name: "Pro",
      description: "Unbegrenzter Zugriff für Power-User",
      monthlyPrice: 6.99,
      yearlyPrice: 69.99,
      // stripePriceIdMonthly: null, // To be updated with actual Stripe price ID
      // stripePriceIdYearly: null, // To be updated with actual Stripe price ID
      // stripeProductId: null, // To be updated with actual Stripe product ID
      stripePriceIdMonthly: "price_1TZ9rZGzyOS6MDj99Pa333wS",
      stripePriceIdYearly: "price_1TZ9tNGzyOS6MDj9OTlibvCy",
      stripeProductId: "prod_TqsX0nvnnyROov",
      features: {
         maxPrompts: -1, // unlimited
         maxCollections: -1, // unlimited
         maxPromptVariables: -1,
         maxGlobalPromptVariables: -1,
         canAccessPromptTemplatingEditor: true,
         canAccessDirectOpenInAiTool: true,
         canExportPrompts: true,
         canShareCollections: true,
         canUseAdvancedFeatures: true,
      },
      isActive: true,
   },
];

export const initSubscriptionPlansData = async (prisma: PrismaClient) => {
   console.log("\Creating subscription plans...");

   for (const plan of subscriptionPlans) {
      await prisma.subscriptionPlan.upsert({
         where: { tier: plan.tier },
         update: {},
         create: plan,
      });
   }

   console.log(`  ✓ ${subscriptionPlans.length} subscription plans created`);
};
