jest.mock("@/data/db/queries/order");
jest.mock("../auth-utils");

import { dtestData, ptestData } from "@tests";

import { pGetOrderById, pGetOrders } from "@/data/db/queries/order";
import { requireUser } from "../auth-utils";

import { getOrderById, getOrders } from "./order.actions";
import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const pGetOrdersMock = pGetOrders as jest.MockedFunction<typeof pGetOrders>;

const pGetOrderByIdMock = pGetOrderById as jest.MockedFunction<
   typeof pGetOrderById
>;

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

describe("getOrderById tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getOrderById - user undefined - test", async () => {
      requireUserMock.mockRejectedValue("Unknow user");
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrderById(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).not.toHaveBeenCalled();
   });

   it("getOrderById - id not valid - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      const orderId = "1";

      const result = await getOrderById(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).not.toHaveBeenCalled();
   });

   it("getOrderById - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      pGetOrderByIdMock.mockRejectedValue("db error");
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrderById(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledWith(orderId);
   });

   it("getOrderById - order null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      pGetOrderByIdMock.mockResolvedValue(null);
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrderById(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledWith(orderId);
   });

   it("getOrderById - order of a different user - test", async () => {
      const user = dtestData.dLoginUser();
      user.id = "123";
      const order = ptestData.pOrderWithItems();
      order.userId = "456";
      requireUserMock.mockResolvedValue(user);
      pGetOrderByIdMock.mockResolvedValue(order);
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrderById(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledWith(orderId);
   });

   it("getOrderById - order retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const order = ptestData.pOrderWithItems();
      order.userId = user.id;
      requireUserMock.mockResolvedValue(user);
      pGetOrderByIdMock.mockResolvedValue(order);
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrderById(orderId);

      const expectedResult = toDOrderWithItems(order);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderByIdMock).toHaveBeenCalledWith(user.id);
   });
});
