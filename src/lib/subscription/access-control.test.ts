import { DSubscriptionTier } from "@/data/types/domain/subscription";

import {
   canAccessFeature,
   FeatureName,
   getFeatureLimit,
   getRemainingCount,
   hasReachedLimit,
   TIER_FEATURES,
   TierFeatures,
} from "./access-control";

const expectFreeTierFeatures: TierFeatures = {
   maxPrompts: 5,
   maxLibraryItems: 3,
   canAccessMarketplace: true,
   canPurchaseItems: false,
   canExportPrompts: false,
   canUseAdvancedFeatures: false,
   canUseWorkflows: false,
   maxWorkflows: 0,
   maxWorkflowSteps: 0,
   canAccessVersionHistory: false,
   maxStoredPromptVersions: 0,
};

const expectBasicTierFeatures: TierFeatures = {
   maxPrompts: 50,
   maxLibraryItems: 20,
   canAccessMarketplace: true,
   canPurchaseItems: true,
   canExportPrompts: true,
   canUseAdvancedFeatures: false,
   canUseWorkflows: true,
   maxWorkflows: 5,
   maxWorkflowSteps: 10,
   canAccessVersionHistory: true,
   maxStoredPromptVersions: 20,
};

const expectProTierFeatures: TierFeatures = {
   maxPrompts: -1,
   maxLibraryItems: -1,
   canAccessMarketplace: true,
   canPurchaseItems: true,
   canExportPrompts: true,
   canUseAdvancedFeatures: true,
   canUseWorkflows: true,
   maxWorkflows: -1,
   maxWorkflowSteps: -1,
   canAccessVersionHistory: true,
   maxStoredPromptVersions: -1,
};

describe("TIER_FEATURES", () => {
   it("should define features for FREE tier", () => {
      expect(TIER_FEATURES.FREE).toEqual(expectFreeTierFeatures);
   });

   it("should define features for BASIC tier", () => {
      expect(TIER_FEATURES.BASIC).toEqual(expectBasicTierFeatures);
   });

   it("should define features for PRO tier", () => {
      expect(TIER_FEATURES.PRO).toEqual(expectProTierFeatures);
   });
});

describe("canAccessFeature tests", () => {
   describe("boolean features", () => {
      it.each<[DSubscriptionTier, FeatureName, boolean]>([
         ["FREE", "canAccessMarketplace", true],
         ["FREE", "canPurchaseItems", false],
         ["FREE", "canExportPrompts", false],
         ["FREE", "canUseAdvancedFeatures", false],
         ["FREE", "canAccessVersionHistory", false],
         ["BASIC", "canAccessMarketplace", true],
         ["BASIC", "canPurchaseItems", true],
         ["BASIC", "canExportPrompts", true],
         ["BASIC", "canUseAdvancedFeatures", false],
         ["BASIC", "canAccessVersionHistory", true],
         ["PRO", "canAccessMarketplace", true],
         ["PRO", "canPurchaseItems", true],
         ["PRO", "canExportPrompts", true],
         ["PRO", "canUseAdvancedFeatures", true],
         ["PRO", "canAccessVersionHistory", true],
      ])(
         "should return %s for %s tier accessing %s",
         (tier, feature, expected) => {
            expect(canAccessFeature(tier, feature)).toBe(expected);
         }
      );
   });

   describe("numeric features", () => {
      it("should return true for FREE tier numeric features with limits", () => {
         expect(canAccessFeature("FREE", "maxPrompts")).toBe(true);
         expect(canAccessFeature("FREE", "maxLibraryItems")).toBe(true);
      });

      it("should return true for BASIC tier numeric features with limits", () => {
         expect(canAccessFeature("BASIC", "maxPrompts")).toBe(true);
         expect(canAccessFeature("BASIC", "maxLibraryItems")).toBe(true);
      });

      it("should return true for PRO tier unlimited numeric features", () => {
         expect(canAccessFeature("PRO", "maxPrompts")).toBe(true);
         expect(canAccessFeature("PRO", "maxLibraryItems")).toBe(true);
      });

      it("should return false for FREE tier maxStoredPromptVersions (0)", () => {
         expect(canAccessFeature("FREE", "maxStoredPromptVersions")).toBe(
            false
         );
      });

      it("should return true for BASIC tier maxStoredPromptVersions (20)", () => {
         expect(canAccessFeature("BASIC", "maxStoredPromptVersions")).toBe(
            true
         );
      });

      it("should return true for PRO tier unlimited maxStoredPromptVersions", () => {
         expect(canAccessFeature("PRO", "maxStoredPromptVersions")).toBe(true);
      });
   });
});

describe("getFeatureLimit tests", () => {
   describe("numeric limits", () => {
      it.each<[DSubscriptionTier, FeatureName, number]>([
         ["FREE", "maxPrompts", 5],
         ["FREE", "maxLibraryItems", 3],
         ["FREE", "maxStoredPromptVersions", 0],
         ["BASIC", "maxPrompts", 50],
         ["BASIC", "maxLibraryItems", 20],
         ["BASIC", "maxStoredPromptVersions", 20],
         ["PRO", "maxPrompts", -1],
         ["PRO", "maxLibraryItems", -1],
         ["PRO", "maxStoredPromptVersions", -1],
      ])(
         "should return %s for %s tier %s feature",
         (tier, feature, expected) => {
            expect(getFeatureLimit(tier, feature)).toBe(expected);
         }
      );
   });

   describe("boolean features", () => {
      it.each<[DSubscriptionTier, FeatureName, boolean]>([
         ["FREE", "canAccessMarketplace", true],
         ["FREE", "canPurchaseItems", false],
         ["FREE", "canExportPrompts", false],
         ["FREE", "canUseAdvancedFeatures", false],
         ["BASIC", "canAccessMarketplace", true],
         ["BASIC", "canPurchaseItems", true],
         ["BASIC", "canExportPrompts", true],
         ["BASIC", "canUseAdvancedFeatures", false],
         ["PRO", "canAccessMarketplace", true],
         ["PRO", "canPurchaseItems", true],
         ["PRO", "canExportPrompts", true],
         ["PRO", "canUseAdvancedFeatures", true],
      ])(
         "should return %s for %s tier %s feature",
         (tier, feature, expected) => {
            expect(getFeatureLimit(tier, feature)).toBe(expected);
         }
      );
   });
});

describe("hasReachedLimit tests", () => {
   describe("boolean features", () => {
      it("should return true for disabled boolean features", () => {
         expect(hasReachedLimit("FREE", "canPurchaseItems", 0)).toBe(true);
         expect(hasReachedLimit("FREE", "canExportPrompts", 0)).toBe(true);
         expect(hasReachedLimit("FREE", "canUseAdvancedFeatures", 0)).toBe(
            true
         );
         expect(hasReachedLimit("BASIC", "canUseAdvancedFeatures", 0)).toBe(
            true
         );
      });

      it("should return false for enabled boolean features", () => {
         expect(hasReachedLimit("FREE", "canAccessMarketplace", 0)).toBe(false);
         expect(hasReachedLimit("BASIC", "canPurchaseItems", 0)).toBe(false);
         expect(hasReachedLimit("BASIC", "canExportPrompts", 0)).toBe(false);
         expect(hasReachedLimit("PRO", "canUseAdvancedFeatures", 0)).toBe(
            false
         );
      });
   });

   describe("unlimited numeric features", () => {
      it("should always return false for PRO tier unlimited features", () => {
         expect(hasReachedLimit("PRO", "maxPrompts", 0)).toBe(false);
         expect(hasReachedLimit("PRO", "maxPrompts", 100)).toBe(false);
         expect(hasReachedLimit("PRO", "maxPrompts", 999999)).toBe(false);
         expect(hasReachedLimit("PRO", "maxLibraryItems", 0)).toBe(false);
         expect(hasReachedLimit("PRO", "maxLibraryItems", 100)).toBe(false);
         expect(hasReachedLimit("PRO", "maxLibraryItems", 999999)).toBe(false);
      });
   });

   describe("limited numeric features", () => {
      describe("FREE tier", () => {
         it("should return false when below maxPrompts limit", () => {
            expect(hasReachedLimit("FREE", "maxPrompts", 0)).toBe(false);
            expect(hasReachedLimit("FREE", "maxPrompts", 3)).toBe(false);
            expect(hasReachedLimit("FREE", "maxPrompts", 4)).toBe(false);
         });

         it("should return true when at or above maxPrompts limit", () => {
            expect(hasReachedLimit("FREE", "maxPrompts", 5)).toBe(true);
            expect(hasReachedLimit("FREE", "maxPrompts", 6)).toBe(true);
            expect(hasReachedLimit("FREE", "maxPrompts", 100)).toBe(true);
         });

         it("should return false when below maxLibraryItems limit", () => {
            expect(hasReachedLimit("FREE", "maxLibraryItems", 0)).toBe(false);
            expect(hasReachedLimit("FREE", "maxLibraryItems", 1)).toBe(false);
            expect(hasReachedLimit("FREE", "maxLibraryItems", 2)).toBe(false);
         });

         it("should return true when at or above maxLibraryItems limit", () => {
            expect(hasReachedLimit("FREE", "maxLibraryItems", 3)).toBe(true);
            expect(hasReachedLimit("FREE", "maxLibraryItems", 4)).toBe(true);
            expect(hasReachedLimit("FREE", "maxLibraryItems", 100)).toBe(true);
         });
      });

      describe("BASIC tier", () => {
         it("should return false when below maxPrompts limit", () => {
            expect(hasReachedLimit("BASIC", "maxPrompts", 0)).toBe(false);
            expect(hasReachedLimit("BASIC", "maxPrompts", 25)).toBe(false);
            expect(hasReachedLimit("BASIC", "maxPrompts", 49)).toBe(false);
         });

         it("should return true when at or above maxPrompts limit", () => {
            expect(hasReachedLimit("BASIC", "maxPrompts", 50)).toBe(true);
            expect(hasReachedLimit("BASIC", "maxPrompts", 51)).toBe(true);
            expect(hasReachedLimit("BASIC", "maxPrompts", 100)).toBe(true);
         });

         it("should return false when below maxLibraryItems limit", () => {
            expect(hasReachedLimit("BASIC", "maxLibraryItems", 0)).toBe(false);
            expect(hasReachedLimit("BASIC", "maxLibraryItems", 10)).toBe(false);
            expect(hasReachedLimit("BASIC", "maxLibraryItems", 19)).toBe(false);
         });

         it("should return true when at or above maxLibraryItems limit", () => {
            expect(hasReachedLimit("BASIC", "maxLibraryItems", 20)).toBe(true);
            expect(hasReachedLimit("BASIC", "maxLibraryItems", 21)).toBe(true);
            expect(hasReachedLimit("BASIC", "maxLibraryItems", 100)).toBe(true);
         });
      });
   });
});

describe("getRemainingCount tests", () => {
   describe("boolean features tests", () => {
      it("should return -1 for boolean features", () => {
         expect(getRemainingCount("FREE", "canPurchaseItems", 0)).toBe(-1);
         expect(getRemainingCount("FREE", "canExportPrompts", 0)).toBe(-1);
         expect(getRemainingCount("BASIC", "canPurchaseItems", 0)).toBe(-1);
         expect(getRemainingCount("PRO", "canUseAdvancedFeatures", 0)).toBe(-1);
      });
   });

   describe("unlimited numeric features tests", () => {
      it("should return -1 for PRO tier unlimited features", () => {
         expect(getRemainingCount("PRO", "maxPrompts", 0)).toBe(-1);
         expect(getRemainingCount("PRO", "maxPrompts", 100)).toBe(-1);
         expect(getRemainingCount("PRO", "maxLibraryItems", 0)).toBe(-1);
         expect(getRemainingCount("PRO", "maxLibraryItems", 100)).toBe(-1);
      });
   });

   describe("limited numeric features tests", () => {
      describe("FREE tier tests", () => {
         it("should return correct remaining count for maxPrompts", () => {
            expect(getRemainingCount("FREE", "maxPrompts", 0)).toBe(5);
            expect(getRemainingCount("FREE", "maxPrompts", 1)).toBe(4);
            expect(getRemainingCount("FREE", "maxPrompts", 3)).toBe(2);
            expect(getRemainingCount("FREE", "maxPrompts", 4)).toBe(1);
            expect(getRemainingCount("FREE", "maxPrompts", 5)).toBe(0);
         });

         it("should return 0 when count exceeds maxPrompts limit", () => {
            expect(getRemainingCount("FREE", "maxPrompts", 6)).toBe(0);
            expect(getRemainingCount("FREE", "maxPrompts", 10)).toBe(0);
            expect(getRemainingCount("FREE", "maxPrompts", 100)).toBe(0);
         });

         it("should return correct remaining count for maxLibraryItems", () => {
            expect(getRemainingCount("FREE", "maxLibraryItems", 0)).toBe(3);
            expect(getRemainingCount("FREE", "maxLibraryItems", 1)).toBe(2);
            expect(getRemainingCount("FREE", "maxLibraryItems", 2)).toBe(1);
            expect(getRemainingCount("FREE", "maxLibraryItems", 3)).toBe(0);
         });

         it("should return 0 when count exceeds maxLibraryItems limit", () => {
            expect(getRemainingCount("FREE", "maxLibraryItems", 4)).toBe(0);
            expect(getRemainingCount("FREE", "maxLibraryItems", 10)).toBe(0);
            expect(getRemainingCount("FREE", "maxLibraryItems", 100)).toBe(0);
         });
      });

      describe("BASIC tier tests", () => {
         it("should return correct remaining count for maxPrompts", () => {
            expect(getRemainingCount("BASIC", "maxPrompts", 0)).toBe(50);
            expect(getRemainingCount("BASIC", "maxPrompts", 10)).toBe(40);
            expect(getRemainingCount("BASIC", "maxPrompts", 25)).toBe(25);
            expect(getRemainingCount("BASIC", "maxPrompts", 49)).toBe(1);
            expect(getRemainingCount("BASIC", "maxPrompts", 50)).toBe(0);
         });

         it("should return 0 when count exceeds maxPrompts limit", () => {
            expect(getRemainingCount("BASIC", "maxPrompts", 51)).toBe(0);
            expect(getRemainingCount("BASIC", "maxPrompts", 100)).toBe(0);
         });

         it("should return correct remaining count for maxLibraryItems", () => {
            expect(getRemainingCount("BASIC", "maxLibraryItems", 0)).toBe(20);
            expect(getRemainingCount("BASIC", "maxLibraryItems", 5)).toBe(15);
            expect(getRemainingCount("BASIC", "maxLibraryItems", 10)).toBe(10);
            expect(getRemainingCount("BASIC", "maxLibraryItems", 19)).toBe(1);
            expect(getRemainingCount("BASIC", "maxLibraryItems", 20)).toBe(0);
         });

         it("should return 0 when count exceeds maxLibraryItems limit", () => {
            expect(getRemainingCount("BASIC", "maxLibraryItems", 21)).toBe(0);
            expect(getRemainingCount("BASIC", "maxLibraryItems", 100)).toBe(0);
         });
      });
   });
});
