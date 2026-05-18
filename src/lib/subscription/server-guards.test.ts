jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/services/subscription");
jest.mock("./access-control");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { SubscriptionService } from "@/data/services/subscription";
import { DSubscriptionTier } from "@/data/types/domain/subscription";

import { canAccessFeature, FeatureName } from "./access-control";
import {
   checkFeatureAccess,
   requireSubscriptionAccess,
   SubscriptionAccessError,
} from "./server-guards";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;
const canAccessFeatureMock = canAccessFeature as jest.MockedFunction<
   typeof canAccessFeature
>;

const sGetUserTier = SubscriptionService.prototype.getUserTier;

const sGetUserTierMock = sGetUserTier as jest.MockedFunction<
   typeof sGetUserTier
>;

describe("SubscriptionAccessError tests", () => {
   it("should create an error with correct name and feature", () => {
      const feature: FeatureName = "canPurchaseItems";
      const message = "Access denied";

      const error = new SubscriptionAccessError(message, feature);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("SubscriptionAccessError");
      expect(error.message).toBe(message);
      expect(error.feature).toBe(feature);
   });

   it("should extend Error class", () => {
      const feature: FeatureName = "canExportPrompts";
      const error = new SubscriptionAccessError("Test error", feature);

      expect(error instanceof Error).toBe(true);
      expect(error instanceof SubscriptionAccessError).toBe(true);
   });
});

describe("requireSubscriptionAccess tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe("successful access", () => {
      it.each<[DSubscriptionTier, FeatureName]>([
         ["FREE", "canAccessMarketplace"],
         ["BASIC", "canPurchaseItems"],
         ["BASIC", "canExportPrompts"],
         ["PRO", "canUseAdvancedFeatures"],
         ["PRO", "maxPrompts"],
         ["PRO", "maxLibraryItems"],
      ])(
         "should allow access for %s tier to %s feature",
         async (tier, feature) => {
            const user = dtestData.dLoginUser();
            requireUserMock.mockResolvedValue(user);
            sGetUserTierMock.mockResolvedValue(tier);
            canAccessFeatureMock.mockReturnValue(true);

            await expect(
               requireSubscriptionAccess(feature)
            ).resolves.toBeUndefined();

            expect(requireUserMock).toHaveBeenCalledTimes(1);
            expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
            expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
            expect(canAccessFeatureMock).toHaveBeenCalledTimes(1);
            expect(canAccessFeatureMock).toHaveBeenCalledWith(tier, feature);
         }
      );
   });

   describe("access denied", () => {
      it.each<[DSubscriptionTier, FeatureName]>([
         ["FREE", "canPurchaseItems"],
         ["FREE", "canExportPrompts"],
         ["FREE", "canUseAdvancedFeatures"],
         ["BASIC", "canUseAdvancedFeatures"],
      ])(
         "should throw SubscriptionAccessError for %s tier accessing %s feature",
         async (tier, feature) => {
            const user = dtestData.dLoginUser();
            requireUserMock.mockResolvedValue(user);
            sGetUserTierMock.mockResolvedValue(tier);
            canAccessFeatureMock.mockReturnValue(false);

            await expect(requireSubscriptionAccess(feature)).rejects.toThrow(
               SubscriptionAccessError
            );

            try {
               await requireSubscriptionAccess(feature);
            } catch (error) {
               expect(error).toBeInstanceOf(SubscriptionAccessError);
               expect((error as SubscriptionAccessError).feature).toBe(feature);
               expect((error as SubscriptionAccessError).message).toBe(
                  `Your current plan (${tier}) does not have access to this feature. Please upgrade to continue.`
               );
            }

            expect(requireUserMock).toHaveBeenCalledTimes(2);
            expect(sGetUserTierMock).toHaveBeenCalledTimes(2);
            expect(canAccessFeatureMock).toHaveBeenCalledTimes(2);
         }
      );
   });

   describe("error scenarios", () => {
      it("should throw error when requireUser fails", async () => {
         const error = new Error("User not authenticated");
         requireUserMock.mockRejectedValue(error);

         await expect(
            requireSubscriptionAccess("canPurchaseItems")
         ).rejects.toThrow(error);

         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(sGetUserTierMock).not.toHaveBeenCalled();
         expect(canAccessFeatureMock).not.toHaveBeenCalled();
      });

      it("should throw error when getUserTier fails", async () => {
         const user = dtestData.dLoginUser();
         const error = new Error("Database error");
         requireUserMock.mockResolvedValue(user);
         sGetUserTierMock.mockRejectedValue(error);

         await expect(
            requireSubscriptionAccess("canPurchaseItems")
         ).rejects.toThrow(error);

         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
         expect(canAccessFeatureMock).not.toHaveBeenCalled();
      });
   });

   describe("with custom dbClient", () => {
      it("should use custom dbClient when provided", async () => {
         const user = dtestData.dLoginUser();
         const tier: DSubscriptionTier = "PRO";

         requireUserMock.mockResolvedValue(user);
         sGetUserTierMock.mockResolvedValue(tier);
         canAccessFeatureMock.mockReturnValue(true);

         await requireSubscriptionAccess("canPurchaseItems");

         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
         expect(canAccessFeatureMock).toHaveBeenCalledWith(
            tier,
            "canPurchaseItems"
         );
      });
   });
});

describe("checkFeatureAccess tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe("successful access checks", () => {
      it("should return true when user has access to feature", async () => {
         const user = dtestData.dLoginUser();
         const tier: DSubscriptionTier = "PRO";
         const feature: FeatureName = "canUseAdvancedFeatures";

         requireUserMock.mockResolvedValue(user);
         sGetUserTierMock.mockResolvedValue(tier);
         canAccessFeatureMock.mockReturnValue(true);

         const result = await checkFeatureAccess(feature);

         expect(result).toBe(true);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
         expect(canAccessFeatureMock).toHaveBeenCalledTimes(1);
      });

      it.each<[DSubscriptionTier, FeatureName]>([
         ["FREE", "canAccessMarketplace"],
         ["BASIC", "canPurchaseItems"],
         ["BASIC", "canExportPrompts"],
         ["PRO", "canUseAdvancedFeatures"],
         ["PRO", "maxPrompts"],
      ])(
         "should return true for %s tier with %s feature",
         async (tier, feature) => {
            const user = dtestData.dLoginUser();
            requireUserMock.mockResolvedValue(user);
            sGetUserTierMock.mockResolvedValue(tier);
            canAccessFeatureMock.mockReturnValue(true);

            const result = await checkFeatureAccess(feature);

            expect(result).toBe(true);
         }
      );
   });

   describe("access denied checks", () => {
      it("should return false when user does not have access", async () => {
         const user = dtestData.dLoginUser();
         const tier: DSubscriptionTier = "FREE";
         const feature: FeatureName = "canPurchaseItems";

         requireUserMock.mockResolvedValue(user);
         sGetUserTierMock.mockResolvedValue(tier);
         canAccessFeatureMock.mockReturnValue(false);

         const result = await checkFeatureAccess(feature);

         expect(result).toBe(false);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
         expect(canAccessFeatureMock).toHaveBeenCalledTimes(1);
      });

      it.each<[DSubscriptionTier, FeatureName]>([
         ["FREE", "canPurchaseItems"],
         ["FREE", "canExportPrompts"],
         ["FREE", "canUseAdvancedFeatures"],
         ["BASIC", "canUseAdvancedFeatures"],
      ])(
         "should return false for %s tier with %s feature",
         async (tier, feature) => {
            const user = dtestData.dLoginUser();
            requireUserMock.mockResolvedValue(user);
            sGetUserTierMock.mockResolvedValue(tier);
            canAccessFeatureMock.mockReturnValue(false);

            const result = await checkFeatureAccess(feature);

            expect(result).toBe(false);
         }
      );
   });

   describe("error scenarios", () => {
      it("should throw error when non-SubscriptionAccessError occurs", async () => {
         const error = new Error("Database connection failed");
         requireUserMock.mockRejectedValue(error);

         await expect(checkFeatureAccess("canPurchaseItems")).rejects.toThrow(
            error
         );
         await expect(checkFeatureAccess("canPurchaseItems")).rejects.toThrow(
            "Database connection failed"
         );

         expect(requireUserMock).toHaveBeenCalledTimes(2);
      });

      it("should rethrow non-SubscriptionAccessError from requireUser", async () => {
         const error = new Error("Authentication failed");
         requireUserMock.mockRejectedValue(error);

         await expect(checkFeatureAccess("canExportPrompts")).rejects.toThrow(
            error
         );
      });

      it("should rethrow non-SubscriptionAccessError from getUserTier", async () => {
         const user = dtestData.dLoginUser();
         const error = new Error("Service unavailable");
         requireUserMock.mockResolvedValue(user);
         sGetUserTierMock.mockRejectedValue(error);

         await expect(checkFeatureAccess("canExportPrompts")).rejects.toThrow(
            error
         );
      });
   });
});
