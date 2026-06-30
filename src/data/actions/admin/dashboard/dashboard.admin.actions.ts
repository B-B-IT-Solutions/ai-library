"use server";

import { requireAdmin } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DAdminStats } from "@/data/types/domain/admin/stats";

export const getAdminStats = async (): Promise<DAdminStats> => {
   await requireAdmin();
   const service = getService();
   return await service.getStats();
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getAdminDashboardService();
};
