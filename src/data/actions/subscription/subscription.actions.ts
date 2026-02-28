"use server";

import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DSubscription,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";

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

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSubscriptionService();
};
