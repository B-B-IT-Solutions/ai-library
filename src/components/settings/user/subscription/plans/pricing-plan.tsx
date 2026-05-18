import { FC } from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import {
   DBillingInterval,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";
import { ActivateSubscriptionButton } from "../buttons";

type PricingPlanProps = {
   plan: DSubscriptionPlan;
   billingInterval: DBillingInterval;
   isCurrent: boolean;
};

export const PricingPlan: FC<PricingPlanProps> = ({
   plan,
   billingInterval,
   isCurrent,
}) => {
   const getPrice = () => {
      const { monthlyPrice, yearlyPrice } = plan;
      return billingInterval === "MONTHLY" ? monthlyPrice : yearlyPrice;
   };

   const price = getPrice();
   const isPopular = plan.tier === "PRO";
   const isFree = plan.tier === "FREE";

   const popularBadge = () => {
      if (isPopular) {
         return (
            <Badge
               className="absolute -top-3 left-1/2 -translate-x-1/2"
               data-testid="popular-badge"
            >
               Most Popular
            </Badge>
         );
      }
   };

   const feature = (label: string) => {
      return (
         <li className="flex items-start" data-testid="feature">
            <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
            <span>{label}</span>
         </li>
      );
   };

   const featurePrompts = () => {
      if (plan.features.maxPrompts === -1) {
         return feature("Unbegrenzte Prompts");
      }
      return feature(`Bis zu ${plan.features.maxPrompts} Prompts`);
   };

   const featureMaxLibraryItems = () => {
      if (plan.features.maxLibraryItems === -1) {
         return feature("Unbegrenzte Bibliotheks-Einträge");
      }
      return feature(
         `Bis zu ${plan.features.maxLibraryItems} Bibliotheks-Einträge`
      );
   };

   const featureMarketplaceAccess = () => {
      if (plan.features.canAccessMarketplace) {
         return feature("Access to marketplace");
      }
   };

   const featureItemsPurchase = () => {
      if (plan.features.canPurchaseItems) {
         return feature("Purchase premium items");
      }
   };

   const featureExportPrompts = () => {
      if (plan.features.canExportPrompts) {
         return feature("Prompts exportieren");
      }
   };

   const featuredvancedFeatures = () => {
      if (plan.features.canUseAdvancedFeatures) {
         return feature("Erweiterte Funktionen");
      }
   };

   const features = () => {
      return (
         <ul className="space-y-3" data-testid="features">
            {featurePrompts()}
            {featureMaxLibraryItems()}
            {featureMarketplaceAccess()}
            {featureItemsPurchase()}
            {featureExportPrompts()}
            {featuredvancedFeatures()}
         </ul>
      );
   };

   const footerBtn = () => {
      if (isFree) {
         return (
            <Button
               variant={isCurrent ? "outline" : "default"}
               disabled={true}
               className="w-full"
               data-testid="free-btn"
            >
               {isCurrent ? "Current Plan" : "Kostenlos starten"}
            </Button>
         );
      }

      if (isCurrent) {
         return (
            <Button
               variant="outline"
               disabled={true}
               className="w-full"
               data-testid="current-btn"
            >
               Current Plan
            </Button>
         );
      }

      return (
         <ActivateSubscriptionButton
            planId={plan.id}
            billingInterval={billingInterval}
            isPopular={isPopular}
         />
      );
   };

   return (
      <Card
         className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}
         data-testid="pricing-plan"
      >
         {popularBadge()}

         <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
         </CardHeader>

         <CardContent>
            <div className="mb-6">
               <span className="text-4xl font-bold">
                  CHF {price.toFixed(2)}
               </span>
               {!isFree && (
                  <span className="text-muted-foreground">
                     /{billingInterval === "MONTHLY" ? "month" : "year"}
                  </span>
               )}
            </div>
            {features()}
         </CardContent>

         <CardFooter>{footerBtn()}</CardFooter>
      </Card>
   );
};
