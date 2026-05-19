import { Check, Star } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { ActivateSubscriptionButton } from "../buttons";

type Props = {
   plan: DSubscriptionPlan;
   billingInterval: DBillingInterval;
   isCurrent: boolean;
};

export const PricingPlan = ({ plan, billingInterval, isCurrent }: Props) => {
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
               className="absolute -top-3.5 left-1/2 -translate-x-1/2 gap-1.5 px-3 py-1"
               data-testid="popular-badge"
            >
               <Star className="h-3 w-3 fill-current" />
               Beliebtester
            </Badge>
         );
      }
   };

   const feature = (label: string) => {
      return (
         <li className="flex items-center gap-2.5" data-testid="feature">
            <Check
               className={cn(
                  "h-4 w-4 shrink-0",
                  isPopular ? "text-primary" : "text-muted-foreground"
               )}
            />
            <span className="text-sm">{label}</span>
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
         return feature("Zugang zum Marktplatz");
      }
   };

   const featureItemsPurchase = () => {
      if (plan.features.canPurchaseItems) {
         return feature("Premium-Inhalte kaufen");
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
               variant={isCurrent ? "outline" : "secondary"}
               disabled={true}
               className="w-full"
               data-testid="free-btn"
            >
               {isCurrent ? "Aktueller Plan" : "Kostenlos"}
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
               Aktueller Plan
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
         className={cn(
            "relative flex flex-col",
            isPopular ? "shadow-xl ring-2 ring-primary" : "shadow-sm"
         )}
         data-testid="pricing-plan"
      >
         {popularBadge()}

         <CardHeader className="pb-4">
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
         </CardHeader>

         <CardContent className="flex flex-1 flex-col gap-6">
            <div>
               <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold">
                     CHF {price.toFixed(2)}
                  </span>
                  {!isFree && (
                     <span className="text-sm text-muted-foreground">
                        /{billingInterval === "MONTHLY" ? "Monat" : "Jahr"}
                     </span>
                  )}
               </div>
               {isFree && (
                  <p className="mt-1 text-sm text-muted-foreground">
                     Für immer kostenlos
                  </p>
               )}
            </div>
            {features()}
         </CardContent>

         <CardFooter>{footerBtn()}</CardFooter>
      </Card>
   );
};
