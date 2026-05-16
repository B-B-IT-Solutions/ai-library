jest.mock("@/data/repositories/subscription");
jest.mock("@/data/repositories/user");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   GetSubscriptionParams,
   SubscriptionRepository,
} from "@/data/repositories/subscription";
import { UserRepository } from "@/data/repositories/user";
import { DSubscriptionTier } from "@/data/types/domain/subscription";

import { SubscriptionService } from "./subscription.service";

const subscriptionRepo = new SubscriptionRepository(prisma);
const subscriptionRepoMock =
   subscriptionRepo as DeepMockProxy<SubscriptionRepository>;

const userRepo = new UserRepository(prisma);
const userRepoMock = userRepo as DeepMockProxy<UserRepository>;

const service = new SubscriptionService(subscriptionRepoMock, userRepoMock);

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
      const historyData = dtestData.dSubscriptionHistoryCreate();

      await service.createSubscriptionHistory(historyData);

      expect(
         subscriptionRepoMock.pCreateSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionRepoMock.pCreateSubscriptionHistory
      ).toHaveBeenCalledWith(historyData);
   });
});

describe("getUserTier tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserTier - subscription is null, no trial - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.getUserTier(userId);

      const expectdResult: DSubscriptionTier = "FREE";
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("getUserTier - subscription.status not ACTIVE, no trial - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "INCOMPLETE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.getUserTier(userId);

      const expectdResult: DSubscriptionTier = "FREE";
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
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
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("getUserTier - BASIC subscription ACTIVE - returns BASIC - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      subscription.plan.tier = "BASIC";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getUserTier(userId);

      expect(result).toEqual("BASIC");
   });

   it("getUserTier - CANCELED within grace period - returns subscription tier - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.plan.tier = "PRO";
      subscription.currentPeriodEnd = new Date(
         Date.now() + 86400000
      ).toISOString(); // +1 day

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getUserTier(userId);

      expect(result).toEqual("PRO");
   });

   it("getUserTier - trial active, no subscription - returns PRO - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() + 7 * 86400000); // 7 days from now
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await service.getUserTier(userId);

      expect(result).toEqual("PRO");
   });

   it("getUserTier - trial expired, no subscription - returns FREE - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() - 86400000); // 1 day ago
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await service.getUserTier(userId);

      expect(result).toEqual("FREE");
   });

   it("getUserTier - PAST_DUE subscription, no trial - returns FREE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "PAST_DUE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.getUserTier(userId);

      expect(result).toEqual("FREE");
   });
});

describe("hasActiveAccess tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("hasActiveAccess - no subscription, no trial, no planChosenAt - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("hasActiveAccess - subscription status ACTIVE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(true);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("hasActiveAccess - subscription status CANCELED in grace period - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.currentPeriodEnd = new Date(
         Date.now() + 86400000
      ).toISOString(); // +1 day

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(true);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("hasActiveAccess - subscription status CANCELED past grace period, no trial, no planChosenAt - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.currentPeriodEnd = new Date(
         Date.now() - 86400000
      ).toISOString(); // -1 day

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("hasActiveAccess - subscription status CANCELED with null currentPeriodEnd - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.currentPeriodEnd = null;

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("hasActiveAccess - subscription status INCOMPLETE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "INCOMPLETE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("hasActiveAccess - subscription status PAST_DUE - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "PAST_DUE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(false);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
   });

   it("hasActiveAccess - trial active - returns true - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() + 7 * 86400000); // 7 days from now
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(true);
   });

   it("hasActiveAccess - trial expired, planChosenAt set - returns true - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() - 86400000); // expired
      user.planChosenAt = new Date("2025-10-01");
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(true);
   });

   it("hasActiveAccess - trial expired, no planChosenAt - returns false - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() - 86400000); // expired
      user.planChosenAt = null;
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await service.hasActiveAccess(userId);

      expect(result).toBe(false);
   });
});

describe("getTrialStatus tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getTrialStatus - no trialEndsAt - isActive false - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = null;
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await service.getTrialStatus(userId);

      expect(result).toEqual({ isActive: false, daysLeft: 0, endsAt: null });
   });

   it("getTrialStatus - trial expired - isActive false - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() - 86400000); // yesterday
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await service.getTrialStatus(userId);

      expect(result.isActive).toBe(false);
      expect(result.daysLeft).toBe(0);
      expect(result.endsAt).toEqual(user.trialEndsAt);
   });

   it("getTrialStatus - trial active, no subscription - returns correct daysLeft - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() + 7 * 86400000); // 7 days from now
      userRepoMock.pGetUserById.mockResolvedValue(user);
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const result = await service.getTrialStatus(userId);

      expect(result.isActive).toBe(true);
      expect(result.daysLeft).toBeGreaterThanOrEqual(6);
      expect(result.daysLeft).toBeLessThanOrEqual(7);
      expect(result.endsAt).toEqual(user.trialEndsAt);
   });

   it("getTrialStatus - trial technically active but subscription ACTIVE - isActive false - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = new Date(Date.now() + 7 * 86400000);
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getTrialStatus(userId);

      expect(result.isActive).toBe(false);
   });
});

describe("setPlanChosen tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("setPlanChosen - sets planChosenAt on user - test", async () => {
      const userId = "user-id-1";
      const user = ptestData.pUser();
      userRepoMock.pUpdateUser.mockResolvedValue(user);

      await service.setPlanChosen(userId);

      expect(userRepoMock.pUpdateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledWith(
         userId,
         expect.objectContaining({ planChosenAt: expect.any(Date) })
      );
   });
});
