"use client";

import { useSession } from "next-auth/react";

import { DSubscriptionTier } from "@/data/types/domain/subscription";
import {
   canAccessFeature,
   FeatureName,
   getFeatureLimit,
   TIER_FEATURES,
} from "@/lib/subscription/access-control";

export const useSubscription = () => {
   const { data: session } = useSession();

   const defaultTier: DSubscriptionTier = "FREE";

   const tier: DSubscriptionTier = session?.user?.tier || defaultTier;

   const isSubscribed = tier !== defaultTier;

   return {
      tier,
      isSubscribed,
      canAccessFeature: (feature: FeatureName) =>
         canAccessFeature(tier, feature),
      getFeatureLimit: (feature: FeatureName) => getFeatureLimit(tier, feature),
      features: TIER_FEATURES[tier],
   };
};
