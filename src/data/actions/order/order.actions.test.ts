jest.mock("@/data/services/order");

import { dtestData } from "@tests";

import { OrderService } from "@/data/services/order";

import { getOrder, getOrders } from "./order.actions";

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
   });

   it("getOrder - order null - test", async () => {
      sGetOrderMock.mockResolvedValue(null);
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      expect(result).toBeNull();
      expect(sGetOrderMock).toHaveBeenCalledTimes(1);
      expect(sGetOrderMock).toHaveBeenCalledWith(orderId);
   });

   it("getOrder - order retrieved - test", async () => {
      const order = dtestData.dOrder();
      sGetOrderMock.mockResolvedValue(order);
      const orderId = "3d6708b6-554d-4ad5-bcd5-9be4825973a3";

      const result = await getOrder(orderId);

      expect(result).toEqual(order);
      expect(sGetOrderMock).toHaveBeenCalledTimes(1);
      expect(sGetOrderMock).toHaveBeenCalledWith(orderId);
   });
});
