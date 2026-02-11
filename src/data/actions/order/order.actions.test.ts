jest.mock("@/data/services/order");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { OrderService } from "@/data/services/order";

import { getOrder, getOrders } from "./order.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetOrders = OrderService.prototype.getOrders;
const sGetOrder = OrderService.prototype.getOrder;

const sGetOrdersMock = sGetOrders as jest.MockedFunction<typeof sGetOrders>;

const sGetOrderMock = sGetOrder as jest.MockedFunction<typeof sGetOrder>;

describe("getOrders tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getOrders - order empty - test", async () => {
      sGetOrdersMock.mockResolvedValue([]);

      const result = await getOrders();

      expect(result).toEqual([]);
      expect(sGetOrdersMock).toHaveBeenCalledTimes(1);
   });

   it("getOrders - orders retrieved - test", async () => {
      const orders = dtestData.dOrders();
      sGetOrdersMock.mockResolvedValue(orders);

      const result = await getOrders();

      expect(result).toEqual(orders);
      expect(sGetOrdersMock).toHaveBeenCalledTimes(1);
   });
});

describe("getOrder tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getOrder - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const errorMessage = "Invalid order ID.";

      const result = await getOrder(invalidId);

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetOrderMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("getOrder - user undefined - test", async () => {
      const error = new Error("Unknow user");
      const orderId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetOrderMock).not.toHaveBeenCalled();
   });

   it("getOrder - order null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetOrderMock.mockResolvedValue(null);
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetOrderMock).toHaveBeenCalledTimes(1);
      expect(sGetOrderMock).toHaveBeenCalledWith(orderId, user.id);
   });

   it("getOrder - order retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const order = dtestData.dOrder();
      sGetOrderMock.mockResolvedValue(order);
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      expect(result).toEqual(order);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetOrderMock).toHaveBeenCalledTimes(1);
      expect(sGetOrderMock).toHaveBeenCalledWith(orderId, user.id);
   });
});
