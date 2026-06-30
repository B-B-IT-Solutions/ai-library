"use server";

import { requireAdmin } from "@/data/actions/auth-utils";
import { AdminDashboardRepository } from "@/data/repositories/admin-dashboard";
import prisma from "@/data/repositories/prisma";
import { DAdminStats } from "@/data/types/domain/admin/stats";

export const getAdminStats = async (): Promise<DAdminStats> => {
   await requireAdmin();
   const repo = new AdminDashboardRepository(prisma);
   return repo.pGetStats();
};
