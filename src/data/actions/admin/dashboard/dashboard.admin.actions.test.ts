jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/services/admin/dashboard");

import { adtestData, dtestData } from "@tests";

import { requireAdmin } from "@/data/actions/auth-utils";
import { AdminDashboardService } from "@/data/services/admin/dashboard";

import { getAdminStats } from "./dashboard.admin.actions";

const sGetStats = AdminDashboardService.prototype.getStats;

const requireAdminMock = requireAdmin as jest.MockedFunction<
   typeof requireAdmin
>;

const sGetStatsMock = sGetStats as jest.MockedFunction<typeof sGetStats>;

describe("getAdminStats tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      const fn = () => getAdminStats();

      await expect(fn).rejects.toThrow();
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetStatsMock).not.toHaveBeenCalled();
   });

   it("stats retrieved - test", async () => {
      const dAdminUser = dtestData.dLoginUser();
      requireAdminMock.mockResolvedValue(dAdminUser);

      const stats = adtestData.dAdminStats();
      sGetStatsMock.mockResolvedValue(stats);

      const result = await getAdminStats();

      expect(result).toEqual(stats);
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetStatsMock).toHaveBeenCalledTimes(1);
   });
});
