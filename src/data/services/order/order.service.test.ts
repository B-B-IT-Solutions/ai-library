jest.mock("@/data/db/queries/order");
jest.mock("@/data/db/queries/cart");
jest.mock("../../actions/auth-utils");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { CartRepository } from "@/data/db/queries/cart";
import { OrderRepository } from "@/data/db/queries/order";
import { requireUser } from "../../actions/auth-utils";

import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";
import { OrderService } from "./order.service";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const orderRepo = new OrderRepository(prisma);
const cartRepo = new CartRepository(prisma);
const orderRepoMock = orderRepo as DeepMockProxy<OrderRepository>;
const cartRepoMock = cartRepo as DeepMockProxy<CartRepository>;

const orderService = new OrderService(orderRepoMock, cartRepoMock);

describe("getOrders tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrders - user undefined - test", async () => {
      const orders = ptestData.pOrdersWithItems();
      requireUserMock.mockRejectedValue("Unknow user");
      orderRepoMock.pGetOrders.mockResolvedValue(orders);

      const result = await orderService.getOrders();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).not.toHaveBeenCalled();
   });

   it("getOrders - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrders.mockRejectedValue("db error");

      const result = await orderService.getOrders();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledWith(user.id);
   });

   it("getOrders - orders retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const orders = ptestData.pOrdersWithItems();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrders.mockResolvedValue(orders);

      const result = await orderService.getOrders();

      const expectedResult = toDOrdersWithItems(orders);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrders).toHaveBeenCalledWith(user.id);
   });
});

describe("getOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrder - user undefined - test", async () => {
      requireUserMock.mockRejectedValue("Unknow user");
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).not.toHaveBeenCalled();
   });

   it("getOrder - id not valid - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      const orderId = "1";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).not.toHaveBeenCalled();
   });

   it("getOrder - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockRejectedValue("db error");

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockResolvedValue(null);

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order of a different user - test", async () => {
      const user = dtestData.dLoginUser();
      user.id = "123";
      const order = ptestData.pOrderWithItems();
      order.userId = "456";
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockResolvedValue(order);

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const order = ptestData.pOrderWithItems();
      order.userId = user.id;
      requireUserMock.mockResolvedValue(user);
      orderRepoMock.pGetOrder.mockResolvedValue(order);

      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await orderService.getOrder(orderId);

      const expectedResult = toDOrderWithItems(order);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledTimes(1);
      expect(orderRepoMock.pGetOrder).toHaveBeenCalledWith(orderId);
   });
});
