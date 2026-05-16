import { Check } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { ActivateSubscriptionButton } from "@/components/settings/user/subscription/buttons";
import { getSubscriptionPlans } from "@/data/actions/subscription";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";
import { TIER_FEATURES } from "@/lib/subscription/access-control";

import { ChooseFreePlanButton } from "./buttons/choose-free-plan-button";

// ─── Plan card helpers ────────────────────────────────────────────────────────

const FeatureItem = ({ label }: { label: string }) => (
   <li className="flex items-start" data-testid="feature-item">
      <Check className="mt-0.5 mr-2 h-5 w-5 shrink-0 text-primary" />
      <span>{label}</span>
   </li>
);

const FreePlanCard = () => {
   const features = TIER_FEATURES["FREE"];

   return (
      <Card className="relative" data-testid="free-plan-card">
         <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Für immer kostenlos</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="mb-6">
               <span className="text-4xl font-bold">CHF 0</span>
               <span className="text-muted-foreground">/Monat</span>
            </div>
            <ul className="space-y-3" data-testid="free-features">
               <FeatureItem label={`Bis zu ${features.maxPrompts} Vorlagen`} />
               <FeatureItem
                  label={`Bis zu ${features.maxLibraryItems} Bibliotheks-Einträge`}
               />
               <FeatureItem label="Zugang zum Marketplace" />
            </ul>
         </CardContent>
         <CardFooter>
            <ChooseFreePlanButton />
         </CardFooter>
      </Card>
   );
};

const PaidPlanCard = ({
   plan,
   isPopular,
}: {
   plan: DSubscriptionPlan;
   isPopular: boolean;
}) => {
   const features = plan.features;

   const promptFeature =
      features.maxPrompts === -1
         ? "Unbegrenzte Vorlagen"
         : `Bis zu ${features.maxPrompts} Vorlagen`;

   const libraryFeature =
      features.maxLibraryItems === -1
         ? "Unbegrenzte Bibliotheks-Einträge"
         : `Bis zu ${features.maxLibraryItems} Bibliotheks-Einträge`;

   return (
      <Card
         className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}
         data-testid="paid-plan-card"
      >
         {isPopular && (
            <Badge
               className="absolute -top-3 left-1/2 -translate-x-1/2"
               data-testid="popular-badge"
            >
               Most Popular
            </Badge>
         )}
         <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="mb-6">
               <span className="text-4xl font-bold">
                  CHF {plan.yearlyPrice.toFixed(2)}
               </span>
               <span className="text-muted-foreground">/Jahr</span>
            </div>
            <ul className="space-y-3" data-testid="paid-features">
               <FeatureItem label={promptFeature} />
               <FeatureItem label={libraryFeature} />
               {features.canAccessMarketplace && (
                  <FeatureItem label="Zugang zum Marketplace" />
               )}
               {features.canPurchaseItems && (
                  <FeatureItem label="Premium-Inhalte kaufen" />
               )}
               {features.canExportPrompts && (
                  <FeatureItem label="Vorlagen exportieren" />
               )}
               {features.canUseAdvancedFeatures && (
                  <FeatureItem label="Erweiterte Funktionen" />
               )}
            </ul>
         </CardContent>
         <CardFooter>
            <ActivateSubscriptionButton
               planId={plan.id}
               billingInterval="YEARLY"
               isPopular={isPopular}
            />
         </CardFooter>
      </Card>
   );
};

// ─── Gate ────────────────────────────────────────────────────────────────────

export const TrialExpiredGate = async () => {
   const plans = await getSubscriptionPlans();

   const paidPlans = plans
      .filter((p) => p.tier !== "FREE")
      .sort((a, b) => {
         const order = { BASIC: 0, PRO: 1 };
         return (order[a.tier as keyof typeof order] ?? 0) - (order[b.tier as keyof typeof order] ?? 0);
      });

   return (
      <div
         className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16"
         data-testid="trial-expired-gate"
      >
         <div className="mb-12 max-w-2xl text-center">
            <h1 className="mb-4 text-4xl font-bold">
               Deine kostenlose Testphase ist abgelaufen
            </h1>
            <p className="text-xl text-muted-foreground">
               Wähle einen Plan um weiterzumachen.
            </p>
         </div>

         <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-3">
            <FreePlanCard />
            {paidPlans.map((plan) => (
               <PaidPlanCard
                  key={plan.id}
                  plan={plan}
                  isPopular={plan.tier === "PRO"}
               />
            ))}
         </div>
      </div>
   );
};
