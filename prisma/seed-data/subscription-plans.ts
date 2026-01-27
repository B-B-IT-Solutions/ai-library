import { Prisma } from "@/generated/prisma/client";

export const subscriptionPlansData: Prisma.SubscriptionPlanCreateInput[] = [
   {
      tier: "FREE",
      name: "Free",
      description: "Get started with basic features",
      monthlyPrice: 0,
      yearlyPrice: 0,
      stripePriceIdMonthly: null,
      stripePriceIdYearly: null,
      stripeProductId: null,
      features: {
         maxPrompts: 5,
         maxLibraryItems: 3,
         canAccessMarketplace: true,
         canPurchaseItems: false,
         canExportPrompts: false,
         canUseAdvancedFeatures: false,
      },
      isActive: true,
   },
   {
      tier: "BASIC",
      name: "Basic",
      description: "Perfect for individuals and small teams",
      monthlyPrice: 9.9,
      yearlyPrice: 99.0,
      // stripePriceIdMonthly: null, // To be updated with actual Stripe price ID
      // stripePriceIdYearly: null, // To be updated with actual Stripe price ID
      // stripeProductId: null, // To be updated with actual Stripe product ID
      stripePriceIdMonthly: "price_1Q7cVWGzyOS6MDj9pbEC42Ax",
      stripePriceIdYearly: "price_1Q7cVWGzyOS6MDj9LkUscmlZ",
      stripeProductId: "prod_Qzbijhak3aLOfT",
      features: {
         maxPrompts: 50,
         maxLibraryItems: 20,
         canAccessMarketplace: true,
         canPurchaseItems: true,
         canExportPrompts: true,
         canUseAdvancedFeatures: false,
      },
      isActive: true,
   },
   {
      tier: "PRO",
      name: "Pro",
      description: "Unlimited access for power users",
      monthlyPrice: 19.9,
      yearlyPrice: 199.0,
      // stripePriceIdMonthly: null, // To be updated with actual Stripe price ID
      // stripePriceIdYearly: null, // To be updated with actual Stripe price ID
      // stripeProductId: null, // To be updated with actual Stripe product ID
      stripePriceIdMonthly: "price_1StAn2GzyOS6MDj99RqYE5NF",
      stripePriceIdYearly: "price_1StAm5GzyOS6MDj9hEhgUOuu",
      stripeProductId: "prod_TqsX0nvnnyROov",
      features: {
         maxPrompts: -1, // unlimited
         maxLibraryItems: -1, // unlimited
         canAccessMarketplace: true,
         canPurchaseItems: true,
         canExportPrompts: true,
         canUseAdvancedFeatures: true,
      },
      isActive: true,
   },
];
