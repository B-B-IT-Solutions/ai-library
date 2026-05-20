import { Prisma } from "@/generated/prisma/client";

export const subscriptionPlansData: Prisma.SubscriptionPlanCreateInput[] = [
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
      stripePriceIdMonthly: "price_1Q7cVWGzyOS6MDj9pbEC42Ax",
      stripePriceIdYearly: "price_1Q7cVWGzyOS6MDj9LkUscmlZ",
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
      stripePriceIdMonthly: "price_1StAn2GzyOS6MDj99RqYE5NF",
      stripePriceIdYearly: "price_1StAm5GzyOS6MDj9hEhgUOuu",
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
