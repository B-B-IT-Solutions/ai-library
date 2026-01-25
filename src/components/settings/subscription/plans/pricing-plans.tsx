"use client";

import { useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import {
   DBillingInterval,
   DSubscription,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";

import { PricingPlan } from "./pricing-plan";

type Props = {
   plans: DSubscriptionPlan[];
   currentSubscription: DSubscription | null;
};

export const PricingPlans = ({ plans, currentSubscription }: Props) => {
   const [billingInterval, setBillingInterval] =
      useState<DBillingInterval>("YEARLY");

   const isCurrentPlan = (planTier: string) => {
      return currentSubscription?.plan.tier === planTier;
   };

   const sortedPlans = [...plans].sort((a, b) => {
      const tierOrder = { FREE: 0, BASIC: 1, PRO: 2 };
      return tierOrder[a.tier] - tierOrder[b.tier];
   });

   return (
      <div>
         <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-lg border p-1">
               <button
                  onClick={() => setBillingInterval("MONTHLY")}
                  className={`rounded-md px-4 py-2 transition-colors ${
                     billingInterval === "MONTHLY"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                  }`}
               >
                  Monthly
               </button>
               <button
                  onClick={() => setBillingInterval("YEARLY")}
                  className={`rounded-md px-4 py-2 transition-colors ${
                     billingInterval === "YEARLY"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                  }`}
               >
                  Yearly
                  <Badge variant="secondary" className="ml-2">
                     Save 17%
                  </Badge>
               </button>
            </div>
         </div>

         <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {sortedPlans.map((plan) => {
               return (
                  <PricingPlan
                     key={plan.id}
                     plan={plan}
                     billingInterval={billingInterval}
                     isCurrent={isCurrentPlan(plan.tier)}
                  />
               );
            })}
         </div>
      </div>
   );
};
