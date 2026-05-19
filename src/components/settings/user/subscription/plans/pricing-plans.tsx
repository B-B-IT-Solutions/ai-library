"use client";

import { useState } from "react";
import { map } from "es-toolkit/compat";

import { Badge } from "@/components/shadcn/badge";
import {
   DBillingInterval,
   DSubscription,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";
import { cn } from "@/lib/utils";

import { PricingPlan } from "./pricing-plan";

type Props = {
   plans: DSubscriptionPlan[];
   currentSubscription: DSubscription | null;
};

export const PricingPlans = ({ plans, currentSubscription }: Props) => {
   const [interval, setInterval] = useState<DBillingInterval>("YEARLY");

   const tierOrder = { FREE: 0, BASIC: 1, PRO: 2 };

   const sortedPlans = [...plans].sort((a, b) => {
      return tierOrder[a.tier] - tierOrder[b.tier];
   });

   const isCurrent = (planTier: string) => {
      return currentSubscription?.plan.tier === planTier;
   };

   const billingIntervalSwitch = () => {
      const isMonthly = interval === "MONTHLY";
      const isYearly = interval === "YEARLY";

      return (
         <div className="inline-flex items-center rounded-full border bg-background p-1 shadow-sm">
            <button
               onClick={() => setInterval("MONTHLY")}
               className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all",
                  isMonthly
                     ? "bg-primary text-primary-foreground shadow-sm"
                     : "text-muted-foreground hover:text-foreground"
               )}
               data-active={isMonthly}
               data-testid="monthly-btn"
            >
               Monatlich
            </button>
            <button
               onClick={() => setInterval("YEARLY")}
               className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
                  isYearly
                     ? "bg-primary text-primary-foreground shadow-sm"
                     : "text-muted-foreground hover:text-foreground"
               )}
               data-active={isYearly}
               data-testid="yearly-btn"
            >
               Jährlich
               <Badge
                  variant="secondary"
                  className={cn(
                     "px-2 py-0.5 text-xs",
                     isYearly
                        ? "border-transparent bg-white/20 text-white"
                        : "border-transparent bg-green-100 text-green-700"
                  )}
               >
                  Spare 17%
               </Badge>
            </button>
         </div>
      );
   };

   const pricingPlans = () => {
      return map(sortedPlans, (plan) => {
         return (
            <PricingPlan
               key={plan.id}
               plan={plan}
               billingInterval={interval}
               isCurrent={isCurrent(plan.tier)}
            />
         );
      });
   };

   return (
      <div data-testid="pricing-plans">
         <div className="mb-8 flex justify-center">
            {billingIntervalSwitch()}
         </div>
         <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {pricingPlans()}
         </div>
      </div>
   );
};
