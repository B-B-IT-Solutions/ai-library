jest.mock("@/data/db/queries/order");
jest.mock("../auth-utils");

import { dtestData, ptestData } from "@tests";

import { pGetOrders } from "@/data/db/queries/order";
import { requireUser } from "../auth-utils";

import { getOrders } from "./order.actions";
import { toDOrdersWithItems } from "./order.mapper";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const pGetOrdersMock = pGetOrders as jest.MockedFunction<typeof pGetOrders>;

describe("getOrders tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getOrders - user undefined - test", async () => {
      const orders = ptestData.pOrdersWithItems();
      requireUserMock.mockRejectedValue("Unknow user");
      pGetOrdersMock.mockResolvedValue(orders);

      const result = await getOrders();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).not.toHaveBeenCalled();
   });

   it("getOrders - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      pGetOrdersMock.mockRejectedValue("db error");

      const result = await getOrders();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).toHaveBeenCalledWith(user.id);
   });

   it("getOrders - orders retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const orders = ptestData.pOrdersWithItems();
      requireUserMock.mockResolvedValue(user);
      pGetOrdersMock.mockResolvedValue(orders);

      const result = await getOrders();

      const expectedResult = toDOrdersWithItems(orders);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).toHaveBeenCalledWith(user.id);
   });
});
