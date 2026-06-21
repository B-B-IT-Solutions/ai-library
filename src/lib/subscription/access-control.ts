import { DSubscriptionTier } from "@/data/types/domain/subscription";

export type TierFeatures = {
   maxPrompts: number; // -1 for unlimited
   maxLibraryItems: number; // -1 for unlimited
   canAccessMarketplace: boolean;
   canPurchaseItems: boolean;
   canExportPrompts: boolean;
   canUseAdvancedFeatures: boolean;
   canUseWorkflows: boolean;
   maxWorkflows: number; // -1 for unlimited
   maxWorkflowSteps: number; // -1 for unlimited
};

export const TIER_FEATURES: Record<DSubscriptionTier, TierFeatures> = {
   FREE: {
      maxPrompts: 5,
      maxLibraryItems: 3,
      canAccessMarketplace: true,
      canPurchaseItems: false,
      canExportPrompts: false,
      canUseAdvancedFeatures: false,
      canUseWorkflows: false,
      maxWorkflows: 0,
      maxWorkflowSteps: 0,
   },
   BASIC: {
      maxPrompts: 50,
      maxLibraryItems: 20,
      canAccessMarketplace: true,
      canPurchaseItems: true,
      canExportPrompts: true,
      canUseAdvancedFeatures: false,
      canUseWorkflows: true,
      maxWorkflows: 5,
      maxWorkflowSteps: 10,
   },
   PRO: {
      maxPrompts: -1, // unlimited
      maxLibraryItems: -1, // unlimited
      canAccessMarketplace: true,
      canPurchaseItems: true,
      canExportPrompts: true,
      canUseAdvancedFeatures: true,
      canUseWorkflows: true,
      maxWorkflows: -1, // unlimited
      maxWorkflowSteps: -1, // unlimited
   },
};

export type FeatureName = keyof TierFeatures;

export const canAccessFeature = (
   tier: DSubscriptionTier,
   feature: FeatureName
): boolean => {
   const tierFeatures = TIER_FEATURES[tier];
   const featureValue = tierFeatures[feature];

   // For boolean features, return the value directly
   if (typeof featureValue === "boolean") {
      return featureValue;
   }

   // For numeric features, check if unlimited (-1) or greater than 0
   return featureValue === -1 || featureValue > 0;
};

export const getFeatureLimit = (
   tier: DSubscriptionTier,
   feature: FeatureName
): number | boolean => {
   return TIER_FEATURES[tier][feature];
};

export const hasReachedLimit = (
   tier: DSubscriptionTier,
   feature: FeatureName,
   currentCount: number
): boolean => {
   const limit = getFeatureLimit(tier, feature);

   // If it's a boolean feature, return !limit
   if (typeof limit === "boolean") {
      return !limit;
   }

   // If unlimited, never reached
   if (limit === -1) {
      return false;
   }

   // Check if current count has reached the limit
   return currentCount >= limit;
};

export const getRemainingCount = (
   tier: DSubscriptionTier,
   feature: FeatureName,
   currentCount: number
): number => {
   const limit = getFeatureLimit(tier, feature);

   // If it's a boolean feature or unlimited, return -1
   if (typeof limit === "boolean" || limit === -1) {
      return -1;
   }

   return Math.max(0, limit - currentCount);
};
