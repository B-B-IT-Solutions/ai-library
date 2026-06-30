jest.mock("@/auth");
jest.mock("@/data/repositories/cart");

import { AuthMockedFunction, ntestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { AdminDashboardRepository } from "@/data/repositories/admin/dashboard";
import prisma from "@/data/repositories/prisma";

import { AdminDashboardService } from "./dashboard.service";

const authMock = auth as unknown as AuthMockedFunction;
const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;

const dashboardRepo = new AdminDashboardRepository(prisma);
const dashboardRepoMock =
   dashboardRepo as DeepMockProxy<AdminDashboardRepository>;

const cartService = new AdminDashboardService(dashboardRepoMock);

describe("getStats tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCart - session null - sessionCartId null - test", async () => {
      dashboardRepoMock.pGetOrCreateCart.mockRejectedValue(
         new Error("invalid userId and sessionCartId")
      );
      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);

      const fn = () => cartService.getCart();

      await expect(fn).rejects.toThrow(Error);
      expect(cookiesMock).toHaveBeenCalledTimes(1);
      expect(dashboardRepoMock.pGetOrCreateCart).toHaveBeenCalledTimes(1);
      expect(dashboardRepoMock.pGetOrCreateCart).toHaveBeenCalledWith({});
   });
});
