jest.mock("next-auth/react");

import { renderHook } from "@testing-library/react";
import { useSession } from "next-auth/react";

import { DSubscriptionTier } from "@/data/types/domain/subscription";
import { TIER_FEATURES } from "@/lib/subscription/access-control";

import { useSubscription } from "./use-subscription";

const useSessionMock = useSession as jest.MockedFunction<typeof useSession>;

describe("useSubscription - tier and isSubscribed - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should default to FREE tier when session is null", () => {
      useSessionMock.mockReturnValue({
         data: null,
         status: "unauthenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("FREE");
      expect(result.current.isSubscribed).toBe(false);
   });

   it("should default to FREE tier when session is undefined", () => {
      useSessionMock.mockReturnValue({
         data: undefined,
         status: "loading",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("FREE");
      expect(result.current.isSubscribed).toBe(false);
   });

   it("should default to FREE tier when session.user is undefined", () => {
      useSessionMock.mockReturnValue({
         data: { expires: "2025-12-31" },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("FREE");
      expect(result.current.isSubscribed).toBe(false);
   });

   it("should default to FREE tier when session.user.tier is undefined", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("FREE");
      expect(result.current.isSubscribed).toBe(false);
   });

   it("should return FREE tier when explicitly set", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "FREE" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("FREE");
      expect(result.current.isSubscribed).toBe(false);
   });

   it("should return BASIC tier and isSubscribed true", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "BASIC" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("BASIC");
      expect(result.current.isSubscribed).toBe(true);
   });

   it("should return PRO tier and isSubscribed true", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "PRO" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("PRO");
      expect(result.current.isSubscribed).toBe(true);
   });
});

describe("useSubscription - features - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should return FREE tier features when user has FREE tier", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "FREE" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.features).toEqual(TIER_FEATURES.FREE);
      expect(result.current.features.maxPrompts).toBe(5);
      expect(result.current.features.maxLibraryItems).toBe(3);
      expect(result.current.features.canAccessMarketplace).toBe(true);
      expect(result.current.features.canPurchaseItems).toBe(false);
      expect(result.current.features.canExportPrompts).toBe(false);
      expect(result.current.features.canUseAdvancedFeatures).toBe(false);
   });

   it("should return BASIC tier features when user has BASIC tier", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "BASIC" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.features).toEqual(TIER_FEATURES.BASIC);
      expect(result.current.features.maxPrompts).toBe(50);
      expect(result.current.features.maxLibraryItems).toBe(20);
      expect(result.current.features.canAccessMarketplace).toBe(true);
      expect(result.current.features.canPurchaseItems).toBe(true);
      expect(result.current.features.canExportPrompts).toBe(true);
      expect(result.current.features.canUseAdvancedFeatures).toBe(false);
   });

   it("should return PRO tier features when user has PRO tier", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "PRO" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.features).toEqual(TIER_FEATURES.PRO);
      expect(result.current.features.maxPrompts).toBe(-1);
      expect(result.current.features.maxLibraryItems).toBe(-1);
      expect(result.current.features.canAccessMarketplace).toBe(true);
      expect(result.current.features.canPurchaseItems).toBe(true);
      expect(result.current.features.canExportPrompts).toBe(true);
      expect(result.current.features.canUseAdvancedFeatures).toBe(true);
   });
});

describe("useSubscription - canAccessFeature - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should return correct access for FREE tier features", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "FREE" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.canAccessFeature("canAccessMarketplace")).toBe(
         true
      );
      expect(result.current.canAccessFeature("canPurchaseItems")).toBe(false);
      expect(result.current.canAccessFeature("canExportPrompts")).toBe(false);
      expect(result.current.canAccessFeature("canUseAdvancedFeatures")).toBe(
         false
      );
      expect(result.current.canAccessFeature("maxPrompts")).toBe(true);
      expect(result.current.canAccessFeature("maxLibraryItems")).toBe(true);
   });

   it("should return correct access for BASIC tier features", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "BASIC" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.canAccessFeature("canAccessMarketplace")).toBe(
         true
      );
      expect(result.current.canAccessFeature("canPurchaseItems")).toBe(true);
      expect(result.current.canAccessFeature("canExportPrompts")).toBe(true);
      expect(result.current.canAccessFeature("canUseAdvancedFeatures")).toBe(
         false
      );
      expect(result.current.canAccessFeature("maxPrompts")).toBe(true);
      expect(result.current.canAccessFeature("maxLibraryItems")).toBe(true);
   });

   it("should return correct access for PRO tier features", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "PRO" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.canAccessFeature("canAccessMarketplace")).toBe(
         true
      );
      expect(result.current.canAccessFeature("canPurchaseItems")).toBe(true);
      expect(result.current.canAccessFeature("canExportPrompts")).toBe(true);
      expect(result.current.canAccessFeature("canUseAdvancedFeatures")).toBe(
         true
      );
      expect(result.current.canAccessFeature("maxPrompts")).toBe(true);
      expect(result.current.canAccessFeature("maxLibraryItems")).toBe(true);
   });

   it("should call canAccessFeature multiple times without issues", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "BASIC" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      const firstCall = result.current.canAccessFeature("canPurchaseItems");
      const secondCall = result.current.canAccessFeature("canPurchaseItems");
      const thirdCall = result.current.canAccessFeature("canExportPrompts");

      expect(firstCall).toBe(true);
      expect(secondCall).toBe(true);
      expect(thirdCall).toBe(true);
   });
});

describe("useSubscription - getFeatureLimit - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should return correct limits for FREE tier", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "FREE" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.getFeatureLimit("maxPrompts")).toBe(5);
      expect(result.current.getFeatureLimit("maxLibraryItems")).toBe(3);
      expect(result.current.getFeatureLimit("canAccessMarketplace")).toBe(true);
      expect(result.current.getFeatureLimit("canPurchaseItems")).toBe(false);
      expect(result.current.getFeatureLimit("canExportPrompts")).toBe(false);
      expect(result.current.getFeatureLimit("canUseAdvancedFeatures")).toBe(
         false
      );
   });

   it("should return correct limits for BASIC tier", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "BASIC" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.getFeatureLimit("maxPrompts")).toBe(50);
      expect(result.current.getFeatureLimit("maxLibraryItems")).toBe(20);
      expect(result.current.getFeatureLimit("canAccessMarketplace")).toBe(true);
      expect(result.current.getFeatureLimit("canPurchaseItems")).toBe(true);
      expect(result.current.getFeatureLimit("canExportPrompts")).toBe(true);
      expect(result.current.getFeatureLimit("canUseAdvancedFeatures")).toBe(
         false
      );
   });

   it("should return correct limits for PRO tier", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "PRO" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.getFeatureLimit("maxPrompts")).toBe(-1);
      expect(result.current.getFeatureLimit("maxLibraryItems")).toBe(-1);
      expect(result.current.getFeatureLimit("canAccessMarketplace")).toBe(true);
      expect(result.current.getFeatureLimit("canPurchaseItems")).toBe(true);
      expect(result.current.getFeatureLimit("canExportPrompts")).toBe(true);
      expect(result.current.getFeatureLimit("canUseAdvancedFeatures")).toBe(
         true
      );
   });

   it("should call getFeatureLimit multiple times without issues", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "BASIC" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result } = renderHook(() => useSubscription());

      const firstCall = result.current.getFeatureLimit("maxPrompts");
      const secondCall = result.current.getFeatureLimit("maxPrompts");
      const thirdCall = result.current.getFeatureLimit("maxLibraryItems");

      expect(firstCall).toBe(50);
      expect(secondCall).toBe(50);
      expect(thirdCall).toBe(20);
   });
});

describe("useSubscription - session changes - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should update tier when session changes", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "FREE" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result, rerender } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("FREE");
      expect(result.current.isSubscribed).toBe(false);

      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "PRO" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      rerender();

      expect(result.current.tier).toBe("PRO");
      expect(result.current.isSubscribed).toBe(true);
      expect(result.current.canAccessFeature("canUseAdvancedFeatures")).toBe(
         true
      );
   });

   it("should update from authenticated to unauthenticated", () => {
      useSessionMock.mockReturnValue({
         data: {
            user: {
               id: "user-1",
               email: "test@test.com",
               role: "USER",
               tier: "PRO" as DSubscriptionTier,
            },
            expires: "2025-12-31",
         },
         status: "authenticated",
         update: jest.fn(),
      });

      const { result, rerender } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe("PRO");
      expect(result.current.isSubscribed).toBe(true);

      useSessionMock.mockReturnValue({
         data: null,
         status: "unauthenticated",
         update: jest.fn(),
      });

      rerender();

      expect(result.current.tier).toBe("FREE");
      expect(result.current.isSubscribed).toBe(false);
   });
});
