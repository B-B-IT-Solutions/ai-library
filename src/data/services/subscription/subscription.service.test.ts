jest.mock("@/data/repositories/subscription");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   GetSubscriptionParams,
   SubscriptionRepository,
} from "@/data/repositories/subscription";
import {
   SubscriptionHistoryCreate,
   SubscriptionUpdate,
} from "@/data/types/db/subscription";
import {
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionTier,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";

import { SubscriptionService } from "./subscription.service";

const subscriptionRepo = new SubscriptionRepository(prisma);
const subscriptionRepoMock =
   subscriptionRepo as DeepMockProxy<SubscriptionRepository>;

const service = new SubscriptionService(subscriptionRepoMock);

describe("getAvailablePlans tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getAvailablePlans - plans retrieved - test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      subscriptionRepoMock.pGetAllPlans.mockResolvedValue(plans);

      const result = await service.getAvailablePlans();

      expect(result).toEqual(plans);
      expect(subscriptionRepoMock.pGetAllPlans).toHaveBeenCalledTimes(1);
   });
});

describe("getPlanByTier tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPlanByTier - plan retrieved - test", async () => {
      const plan = dtestData.dSubscriptionPlan();
      subscriptionRepoMock.pGetPlanByTier.mockResolvedValue(plan);

      const tier: DSubscriptionTier = "PRO";
      const result = await service.getPlanByTier(tier);

      expect(result).toEqual(plan);
      expect(subscriptionRepoMock.pGetPlanByTier).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetPlanByTier).toHaveBeenCalledWith(tier);
   });
});

describe("getPlanById tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPlanById - plan not found - test", async () => {
      const planId = "plan-id-1";
      subscriptionRepoMock.pGetPlanById.mockResolvedValue(null);

      const fn = () => service.getPlanById(planId);

      await expect(fn).rejects.toThrow("Subscription plan not found");
      expect(subscriptionRepoMock.pGetPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetPlanById).toHaveBeenCalledWith(planId);
   });

   it("getPlanById - plan not active - test", async () => {
      const planId = "plan-id-1";
      const plan = dtestData.dSubscriptionPlan();
      plan.isActive = false;

      subscriptionRepoMock.pGetPlanById.mockResolvedValue(plan);

      const fn = () => service.getPlanById(planId);

      await expect(fn).rejects.toThrow(
         "This subscription plan is not available"
      );
      expect(subscriptionRepoMock.pGetPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetPlanById).toHaveBeenCalledWith(planId);
   });

   it("getPlanById - plan retrieved successfully - test", async () => {
      const planId = "plan-id-1";
      const plan = dtestData.dSubscriptionPlan();
      plan.isActive = true;

      subscriptionRepoMock.pGetPlanById.mockResolvedValue(plan);

      const result = await service.getPlanById(planId);

      expect(result).toEqual(plan);
      expect(subscriptionRepoMock.pGetPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetPlanById).toHaveBeenCalledWith(planId);
   });
});

describe("getSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getSubscription - subscription retrieved - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getSubscription(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(subscription);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });
});

describe("getSubscriptionByStripeSubscriptionId tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getSubscription - subscription retrieved - test", async () => {
      const stripeSubscriptionId = "stripe-subscription-id-1";
      const subscription = dtestData.dSubscription();
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result =
         await service.getSubscriptionByStripeSubscriptionId(
            stripeSubscriptionId
         );

      const expectedGetParams: GetSubscriptionParams = {
         stripeSubscriptionId,
      };

      expect(result).toEqual(subscription);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });
});

describe("createSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createSubscription - subscription created - test", async () => {
      const createData = dtestData.dSubscriptionCreate();

      await service.createSubscription(createData);

      expect(subscriptionRepoMock.pCreateSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pCreateSubscription).toHaveBeenCalledWith(
         createData
      );
   });
});

describe("updateSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateSubscription - subscription updated - test", async () => {
      const userId = "user-id-1";
      const subscriptionData = dtestData.dSubscriptionUpdate();

      await service.updateSubscription(userId, subscriptionData);

      expect(subscriptionRepoMock.pUpdateSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pUpdateSubscription).toHaveBeenCalledWith(
         userId,
         subscriptionData
      );
   });
});

describe("deleteSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteSubscription - subscription deleted - test", async () => {
      const userId = "user-id-1";

      await service.deleteSubscription(userId);

      expect(subscriptionRepoMock.pDeleteSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pDeleteSubscription).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("createSubscriptionHistory tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createSubscriptionHistory - history created - test", async () => {
      const historyData: DSubscriptionHistoryCreate = {
         userId: "user-id-1",
         eventType: "activated",
         fromStatus: "INCOMPLETE",
         toStatus: "ACTIVE",
         metadata: {
            test: "value",
         },
      };

      await service.createSubscriptionHistory(historyData);

      const expectedCreateData: SubscriptionHistoryCreate = {
         ...historyData,
      };

      expect(
         subscriptionRepoMock.pCreateSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionRepoMock.pCreateSubscriptionHistory
      ).toHaveBeenCalledWith(expectedCreateData);
   });
});

describe("getUserTier tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserTier - subscription is null - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const result = await service.getUserTier(userId);

      const expectdResult: DSubscriptionTier = "FREE";

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("getUserTier - subscription.status not ACTIVE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "INCOMPLETE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getUserTier(userId);

      const expectdResult: DSubscriptionTier = "FREE";

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("getUserTier - subscription.status ACTIVE - test", async () => {
      const userId = "user-id-1";
      const tier: DSubscriptionTier = "PRO";
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      subscription.plan.tier = tier;

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getUserTier(userId);

      const expectdResult: DSubscriptionTier = tier;

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });
});

describe("hasActiveAccess tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("hasActiveAccess - no subscription - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const result = await service.hasActiveAccess(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("hasActiveAccess - subscription status ACTIVE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toBe(true);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("hasActiveAccess - subscription status CANCELED in grace period - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      // Set current period end to future date (in grace period)
      subscription.currentPeriodEnd = new Date(
         Date.now() + 86400000
      ).toISOString(); // +1 day

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toBe(true);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("hasActiveAccess - subscription status CANCELED past grace period - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      // Set current period end to past date (past grace period)
      subscription.currentPeriodEnd = new Date(
         Date.now() - 86400000
      ).toISOString(); // -1 day

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("hasActiveAccess - subscription status CANCELED with null currentPeriodEnd - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.currentPeriodEnd = null;

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("hasActiveAccess - subscription status INCOMPLETE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "INCOMPLETE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });

   it("hasActiveAccess - subscription status PAST_DUE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "PAST_DUE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
   });
});
