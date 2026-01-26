jest.mock("@/data/repositories/subscription");

import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { SubscriptionRepository } from "@/data/repositories/subscription";
import { DSubscriptionTier } from "@/data/types/domain/subscription";

import {
   toDSubscription,
   toDSubscriptionPlan,
   toDSubscriptionPlans,
} from "./subscription.mapper";
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
      const plans = ptestData.pSubscriptionPlans();
      subscriptionRepoMock.pGetAllPlans.mockResolvedValue(plans);

      const result = await service.getAvailablePlans();

      const expectdResult = toDSubscriptionPlans(plans);
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetAllPlans).toHaveBeenCalledTimes(1);
   });
});

describe("getPlanByTier tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPlanByTier - plan is null - test", async () => {
      subscriptionRepoMock.pGetPlanByTier.mockResolvedValue(null);

      const tier: DSubscriptionTier = "PRO";
      const result = await service.getPlanByTier(tier);

      expect(result).toBeNull();
      expect(subscriptionRepoMock.pGetPlanByTier).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetPlanByTier).toHaveBeenCalledWith(tier);
   });

   it("getPlanByTier - plan retrieved - test", async () => {
      const plan = ptestData.pSubscriptionPlan();
      subscriptionRepoMock.pGetPlanByTier.mockResolvedValue(plan);

      const tier: DSubscriptionTier = "PRO";
      const result = await service.getPlanByTier(tier);

      const expectdResult = toDSubscriptionPlan(plan);
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetPlanByTier).toHaveBeenCalledTimes(1);
      expect(subscriptionRepoMock.pGetPlanByTier).toHaveBeenCalledWith(tier);
   });
});

describe("getUserSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserSubscription - subscription is null - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetUserSubscription.mockResolvedValue(null);

      const result = await service.getUserSubscription(userId);

      expect(result).toBeNull();
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledWith(
         userId
      );
   });

   it("getUserSubscription - subscription retrieved - test", async () => {
      const userId = "user-id-1";
      const subscription = ptestData.pSubscriptionWithPlan();
      subscriptionRepoMock.pGetUserSubscription.mockResolvedValue(subscription);

      const result = await service.getUserSubscription(userId);

      const expectdResult = toDSubscription(subscription);
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("getUserTier tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserTier - subscription is null - test", async () => {
      const userId = "user-id-1";
      subscriptionRepoMock.pGetUserSubscription.mockResolvedValue(null);

      const result = await service.getUserTier(userId);

      const expectdResult: DSubscriptionTier = "FREE";
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledWith(
         userId
      );
   });

   it("getUserTier - subscription not ACTIVE - test", async () => {
      const userId = "user-id-1";
      const subscription = ptestData.pSubscriptionWithPlan();
      subscription.status =
         subscriptionRepoMock.pGetUserSubscription.mockResolvedValue(
            subscription
         );

      const result = await service.getUserTier(userId);

      const expectdResult: DSubscriptionTier = "FREE";
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledWith(
         userId
      );
   });

   it("getUserTier - subscription retrieved - test", async () => {
      const userId = "user-id-1";
      const subscription = ptestData.pSubscriptionWithPlan();
      subscriptionRepoMock.pGetUserSubscription.mockResolvedValue(subscription);

      const result = await service.getUserSubscription(userId);

      const expectdResult = toDSubscription(subscription);
      expect(result).toEqual(expectdResult);
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionRepoMock.pGetUserSubscription).toHaveBeenCalledWith(
         userId
      );
   });
});
