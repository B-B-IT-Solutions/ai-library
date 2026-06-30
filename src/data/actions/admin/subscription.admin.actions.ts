"use server";

import { requireAdminUser } from "@/data/actions/auth-utils";
import { AdminSubscriptionRepository } from "@/data/repositories/admin";
import prisma from "@/data/repositories/prisma";
import {
   DAdminSubscriptionsPage,
   DAdminSubscriptionsPageQuery,
} from "@/data/types/domain/admin";

export const getAdminSubscriptionsPage = async (
   query?: DAdminSubscriptionsPageQuery
): Promise<DAdminSubscriptionsPage> => {
   await requireAdminUser();
   const repo = new AdminSubscriptionRepository(prisma);
   return repo.pGetSubscriptionsPage(query);
};
