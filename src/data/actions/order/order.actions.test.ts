jest.mock("@/data/db/queries/order");
jest.mock("../auth-utils");

import { dtestData, ptestData } from "@tests";

import { OrderRepository } from "@/data/db/queries/order";
import { requireUser } from "../auth-utils";

import { getOrder, getOrders } from "./order.actions";
import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const OrderRepositoryMock = OrderRepository as jest.MockedClass<
   typeof OrderRepository
>;

describe("getOrders tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrders - user undefined - test", async () => {
      const orders = ptestData.pOrdersWithItems();
      requireUserMock.mockRejectedValue("Unknow user");

      const pGetOrdersMock = jest.fn().mockResolvedValue(orders);
      OrderRepositoryMock.prototype.pGetOrders = pGetOrdersMock;

      const result = await getOrders();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).not.toHaveBeenCalled();
   });

   it("getOrders - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const pGetOrdersMock = jest.fn().mockRejectedValue("db error");
      OrderRepositoryMock.prototype.pGetOrders = pGetOrdersMock;

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

      const pGetOrdersMock = jest.fn().mockResolvedValue(orders);
      OrderRepositoryMock.prototype.pGetOrders = pGetOrdersMock;

      const result = await getOrders();

      const expectedResult = toDOrdersWithItems(orders);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).toHaveBeenCalledTimes(1);
      expect(pGetOrdersMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrder - user undefined - test", async () => {
      requireUserMock.mockRejectedValue("Unknow user");
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const pGetOrderMock = jest.fn();
      OrderRepositoryMock.prototype.pGetOrder = pGetOrderMock;

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).not.toHaveBeenCalled();
   });

   it("getOrder - id not valid - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      const orderId = "1";

      const pGetOrderMock = jest.fn();
      OrderRepositoryMock.prototype.pGetOrder = pGetOrderMock;

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).not.toHaveBeenCalled();
   });

   it("getOrder - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const pGetOrderMock = jest.fn().mockRejectedValue("db error");
      OrderRepositoryMock.prototype.pGetOrder = pGetOrderMock;

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const pGetOrderMock = jest.fn().mockResolvedValue(null);
      OrderRepositoryMock.prototype.pGetOrder = pGetOrderMock;

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order of a different user - test", async () => {
      const user = dtestData.dLoginUser();
      user.id = "123";
      const order = ptestData.pOrderWithItems();
      order.userId = "456";
      requireUserMock.mockResolvedValue(user);

      const pGetOrderMock = jest.fn().mockResolvedValue(order);
      OrderRepositoryMock.prototype.pGetOrder = pGetOrderMock;

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const order = ptestData.pOrderWithItems();
      order.userId = user.id;
      requireUserMock.mockResolvedValue(user);

      const pGetOrderMock = jest.fn().mockResolvedValue(order);
      OrderRepositoryMock.prototype.pGetOrder = pGetOrderMock;

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      const expectedResult = toDOrderWithItems(order);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledTimes(1);
      expect(pGetOrderMock).toHaveBeenCalledWith(orderId);
   });
});
