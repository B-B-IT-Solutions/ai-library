"use server";

import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DSubscription,
   DSubscriptionPlan,
   DTrialStatus,
} from "@/data/types/domain/subscription";
import { formatError } from "../utils";

export const getSubscriptionPlans = async (): Promise<DSubscriptionPlan[]> => {
   await requireUser();
   const service = getService();
   return await service.getAvailablePlans();
};

export const getSubscription = async (): Promise<DSubscription | null> => {
   const user = await requireUser();
   const service = getService();
   return await service.getSubscription(user.id);
};

export const getTrialStatus = async (): Promise<DTrialStatus | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTrialStatus(user.id);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSubscriptionService();
};
