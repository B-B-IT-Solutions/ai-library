jest.mock("@/auth");
jest.mock("@/data/repositories/admin/dashboard");

import { adtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { AdminDashboardRepository } from "@/data/repositories/admin/dashboard";
import prisma from "@/data/repositories/prisma";

import { AdminDashboardService } from "./dashboard.service";

const dashboardRepo = new AdminDashboardRepository(prisma);
const dashboardRepoMock =
   dashboardRepo as DeepMockProxy<AdminDashboardRepository>;

const dashboardService = new AdminDashboardService(dashboardRepoMock);

describe("getStats tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("stats retrieved - test", async () => {
      const stats = adtestData.dAdminStats();
      dashboardRepoMock.pGetStats.mockResolvedValue(stats);

      const result = await dashboardService.getStats();

      expect(result).toEqual(stats);
      expect(dashboardRepoMock.pGetStats).toHaveBeenCalledTimes(1);
   });
});
