jest.mock("@/data/repositories/subscription");
jest.mock("@/data/services/user");
jest.mock("@/lib/subscription/access-control");

import { dtestData } from "@tests";
import { addDays, subDays } from "date-fns";
import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import {
   GetSubscriptionParams,
   SubscriptionRepository,
} from "@/data/repositories/subscription";
import { ServiceFactory } from "@/data/services//service.factory";
import { UserService } from "@/data/services/user";
import {
   DSubscriptionTier,
   DTrialStatus,
} from "@/data/types/domain/subscription";
import {
   FeatureName,
   getFeatureLimit,
   hasReachedLimit,
} from "@/lib/subscription/access-control";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

import { SubscriptionService } from "./subscription.service";

const getFeatureLimitMock = getFeatureLimit as jest.MockedFunction<
   typeof getFeatureLimit
>;

const hasReachedLimitMock = hasReachedLimit as jest.MockedFunction<
   typeof hasReachedLimit
>;

const serviceFactory = new ServiceFactory(prisma);
const userService = serviceFactory.getUserService();

const subscriptionRepo = new SubscriptionRepository(prisma);
const subscriptionRepoMock =
   subscriptionRepo as DeepMockProxy<SubscriptionRepository>;

const userServiceMock = userService as DeepMockProxy<UserService>;

const service = new SubscriptionService(subscriptionRepoMock, userServiceMock);

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

   it("subscription null - no trial - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);
      userServiceMock.getUserInternalById.mockResolvedValue(null);

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
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledWith(userId);
   });

   it("subscription.status not ACTIVE, no trial - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "INCOMPLETE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userServiceMock.getUserInternalById.mockResolvedValue(null);

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
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledWith(userId);
   });

   it("subscription.status ACTIVE - tier PRO - test", async () => {
      const userId = "user-id-1";
      const tier: DSubscriptionTier = "PRO";
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      subscription.plan.tier = tier;

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getUserTier(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(tier);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
      expect(userServiceMock.getUserInternalById).not.toHaveBeenCalled();
   });

   it("subscription.status ACTIVE - tier BASIC - test", async () => {
      const userId = "user-id-1";
      const tier: DSubscriptionTier = "BASIC";
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      subscription.plan.tier = tier;

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getUserTier(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(tier);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
      expect(userServiceMock.getUserInternalById).not.toHaveBeenCalled();
   });

   it("subscription.status CANCELED - within grace period - test", async () => {
      const userId = "user-id-1";
      const tier: DSubscriptionTier = "PRO";
      const tomorrow = addDays(Date.now(), 1);

      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.plan.tier = tier;
      subscription.currentPeriodEnd = tomorrow.toISOString();

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getUserTier(userId);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(tier);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
      expect(userServiceMock.getUserInternalById).not.toHaveBeenCalled();
   });

   it("subscription null - trial active - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const user = dtestData.dUserInternal();
      user.trialEndsAt = addDays(Date.now(), 7);
      userServiceMock.getUserInternalById.mockResolvedValue(user);

      const result = await service.getUserTier(userId);
      const expectdResult: DSubscriptionTier = "PRO";

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledWith(userId);
   });

   it("subscription null - trial expired - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const user = dtestData.dUserInternal();
      user.trialEndsAt = subDays(Date.now(), 1);
      userServiceMock.getUserInternalById.mockResolvedValue(user);

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
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledWith(userId);
   });

   it("subscription.status PAST_DUE - no trial - test", async () => {
      const userId = "user-id-1";
      const subscription = dtestData.dSubscription();
      subscription.status = "PAST_DUE";

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);
      userServiceMock.getUserInternalById.mockResolvedValue(null);

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
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledWith(userId);
   });
});

describe("getTrialStatus tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("user null - test", async () => {
      const userId = "user-id-1";
      userServiceMock.getUserInternalById.mockResolvedValue(null);

      const result = await service.getTrialStatus(userId);

      const expectdResult: DTrialStatus = {
         isActive: false,
         daysLeft: 0,
         endsAt: null,
      };

      expect(result).toEqual(expectdResult);
   });

   it("trialEndsAt null - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = null;
      userServiceMock.getUserInternalById.mockResolvedValue(user);

      const result = await service.getTrialStatus(userId);

      const expectdResult: DTrialStatus = {
         isActive: false,
         daysLeft: 0,
         endsAt: null,
      };

      expect(result).toEqual(expectdResult);
   });

   it("trial expired - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = subDays(Date.now(), 1); // yesterday
      userServiceMock.getUserInternalById.mockResolvedValue(user);

      const result = await service.getTrialStatus(userId);

      const expectdResult: DTrialStatus = {
         isActive: false,
         daysLeft: 0,
         endsAt: user.trialEndsAt,
      };

      expect(result).toEqual(expectdResult);
   });

   it("trial active - subscription null - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = addDays(Date.now(), 7); // 7 days from now

      userServiceMock.getUserInternalById.mockResolvedValue(user);
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);

      const result = await service.getTrialStatus(userId);

      const expectdResult: DTrialStatus = {
         isActive: true,
         daysLeft: 7,
         endsAt: user.trialEndsAt,
      };

      expect(result).toEqual(expectdResult);
   });

   it("trial active (technically) - subscription active - test", async () => {
      const userId = "user-id-1";
      const user = dtestData.dUserInternal();
      user.trialEndsAt = addDays(Date.now(), 5); // 5 days from now
      userServiceMock.getUserInternalById.mockResolvedValue(user);

      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      subscriptionRepoMock.pGetSubscription.mockResolvedValue(subscription);

      const result = await service.getTrialStatus(userId);

      const expectdResult: DTrialStatus = {
         isActive: false,
         daysLeft: 0,
         endsAt: user.trialEndsAt,
      };

      expect(result).toEqual(expectdResult);
   });
});

describe("requireCountLimit tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("hasReachedLimit false - test", async () => {
      const userId = "user-id-1";
      const tier: DSubscriptionTier = "FREE";
      const feature: FeatureName = "maxPrompts";
      const currentCount = 5;

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);
      userServiceMock.getUserInternalById.mockResolvedValue(null);
      hasReachedLimitMock.mockReturnValue(false);

      await service.requireCountLimit(userId, feature, currentCount);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(hasReachedLimitMock).toHaveBeenCalledTimes(1);
      expect(hasReachedLimitMock).toHaveBeenCalledWith(
         tier,
         feature,
         currentCount
      );
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledWith(userId);
      expect(getFeatureLimitMock).not.toHaveBeenCalled();
   });

   it("hasReachedLimit true - test", async () => {
      const userId = "user-id-1";
      const tier: DSubscriptionTier = "FREE";
      const feature: FeatureName = "maxPrompts";
      const currentCount = 15;

      subscriptionRepoMock.pGetSubscription.mockResolvedValue(null);
      userServiceMock.getUserInternalById.mockResolvedValue(null);
      hasReachedLimitMock.mockReturnValue(true);

      const fn = () => service.requireCountLimit(userId, feature, currentCount);

      await expect(fn).rejects.toThrow(SubscriptionAccessError);

      const expectedGetParams: GetSubscriptionParams = {
         userId,
      };

      expect(hasReachedLimitMock).toHaveBeenCalledTimes(1);
      expect(hasReachedLimitMock).toHaveBeenCalledWith(
         tier,
         feature,
         currentCount
      );
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetSubscription).toHaveBeenCalledWith(
         expectedGetParams
      );
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserInternalById).toHaveBeenCalledWith(userId);
      expect(getFeatureLimitMock).toHaveBeenCalledTimes(1);
      expect(getFeatureLimitMock).toHaveBeenCalledWith(tier, feature);
   });
});

describe("isSubscriptinoActive tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("subscription null - test", async () => {
      const result = service.isSubscriptinoActive(null);
      expect(result).toBe(false);
   });

   it("subscription.status CANCELED - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";

      const result = service.isSubscriptinoActive(null);
      expect(result).toBe(false);
   });

   it("subscription.status ACTIVE - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";

      const result = service.isSubscriptinoActive(subscription);
      expect(result).toBe(true);
   });
});

describe("isSubscriptionWithiGracePeriod tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("subscription null - test", async () => {
      const result = service.isSubscriptionWithiGracePeriod(null);
      expect(result).toBe(false);
   });

   it("subscription.status ACTIVE - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";

      const result = service.isSubscriptionWithiGracePeriod(null);
      expect(result).toBe(false);
   });

   it("subscription.status CANCELED - after grace period - test", async () => {
      const yesterday = subDays(Date.now(), 1);
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.currentPeriodEnd = yesterday.toISOString();

      const result = service.isSubscriptionWithiGracePeriod(subscription);
      expect(result).toBe(false);
   });

   it("subscription.status CANCELED - within grace period - test", async () => {
      const tomorrow = addDays(Date.now(), 1);
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.currentPeriodEnd = tomorrow.toISOString();

      const result = service.isSubscriptionWithiGracePeriod(subscription);
      expect(result).toBe(true);
   });
});
