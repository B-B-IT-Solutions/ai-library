jest.mock("@/data/actions/admin/dashboard");

import { screen, waitFor } from "@testing-library/dom";
import { adtestData, assertInDocument, renderAsyncRSC } from "@tests";

import { getAdminStats } from "@/data/actions/admin/dashboard";

import { AdminDashboard } from "./admin-dashboard";

const getAdminStatsMock = getAdminStats as jest.MockedFunction<
   typeof getAdminStats
>;

const assertRendered = () => {
   const dashboard = screen.getByTestId("admin-dashboard");
   const kpis = screen.getAllByTestId("kpi");

   assertInDocument(dashboard);
   expect(kpis).toHaveLength(2);
};

describe("AdminDashboard rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      const stats = adtestData.dAdminStats();
      getAdminStatsMock.mockResolvedValue(stats);

      const { container } = await renderAsyncRSC(AdminDashboard, {});

      await waitFor(() => {
         assertRendered();
         expect(getAdminStats).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
