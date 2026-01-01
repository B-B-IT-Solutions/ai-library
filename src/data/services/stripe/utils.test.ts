import { dtestData } from "@tests";

import { toStripePriceUnit } from "./utils";

describe("calculateSubTotalAmount tests", () => {
   it("calculateSubTotalAmount test", async () => {
      const item = dtestData.dCartItem();
      item.productPrice = 19.99;
      const price1 = toStripePriceUnit(item);
      expect(price1).toEqual(1999);

      item.productPrice = 299.9;
      const price2 = toStripePriceUnit(item);
      expect(price2).toEqual(29990);

      item.productPrice = 590;
      const price3 = toStripePriceUnit(item);
      expect(price3).toEqual(59000);
   });
});
