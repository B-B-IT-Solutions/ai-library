import { ptestData } from "@tests";

import { calculateSubTotalAmount } from "./utils";

describe("calculateSubTotalAmount tests", () => {
   it("calculateSubTotalAmount test", async () => {
      const cart1 = ptestData.pCartWithItems(1, 3);
      const subtotal1 = calculateSubTotalAmount(cart1);
      expect(subtotal1).toEqual(59.97);

      const cart2 = ptestData.pCartWithItems(1, 4);
      const subtotal2 = calculateSubTotalAmount(cart2);
      expect(subtotal2).toEqual(79.96);

      const cart3 = ptestData.pCartWithItems(1, 5);
      const subtotal3 = calculateSubTotalAmount(cart3);
      expect(subtotal3).toEqual(99.95);
   });
});
