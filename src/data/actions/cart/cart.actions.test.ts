jest.mock("@/data/services/cart");

import { dtestData } from "@tests";

import { CartService } from "@/data/services/cart";

import {
   addToCart,
   getCart,
   migrateSessionCartToUser,
   removeFromCart,
} from "./cart.actions";

const sGetCart = CartService.prototype.getCart;
const sAddToCart = CartService.prototype.addToCart;
const sRemoveFromCart = CartService.prototype.removeFromCart;
const sMigrateSessionCartToUser =
   CartService.prototype.migrateSessionCartToUser;

const sGetCartMock = sGetCart as jest.MockedFunction<typeof sGetCart>;
const sAddToCartMock = sAddToCart as jest.MockedFunction<typeof sAddToCart>;
const sRemoveFromCartMock = sRemoveFromCart as jest.MockedFunction<
   typeof sRemoveFromCart
>;
const sMigrateSessionCartToUserMock =
   sMigrateSessionCartToUser as jest.MockedFunction<
      typeof sMigrateSessionCartToUser
   >;

describe("getCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCart - cart retrieved - test", async () => {
      const cart = dtestData.dCart();
      sGetCartMock.mockResolvedValue(cart);

      const result = await getCart();

      expect(result).toEqual(cart);
      expect(sGetCartMock).toHaveBeenCalledTimes(1);
   });
});

describe("addToCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("addToCart - error - test", async () => {
      const error = new Error("db error");
      sAddToCartMock.mockRejectedValue(error);

      const product = dtestData.dProduct();

      const result = await addToCart(product);

      const expectedResult = {
         success: false,
         message: "Item couldn't be added to the cart.",
      };

      expect(result).toEqual(expectedResult);
      expect(sAddToCartMock).toHaveBeenCalledTimes(1);
      expect(sAddToCartMock).toHaveBeenCalledWith(product);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("addToCart test", async () => {
      const product = dtestData.dProduct();
      sAddToCartMock.mockResolvedValue();

      const result = await addToCart(product);

      const expectedResult = {
         success: true,
         message: "Item added to the cart successfully.",
      };

      expect(result).toEqual(expectedResult);
      expect(sAddToCartMock).toHaveBeenCalledTimes(1);
      expect(sAddToCartMock).toHaveBeenCalledWith(product);
   });
});

describe("removeFromCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("removeFromCart - success - test", async () => {
      const item = dtestData.dCartItem();
      const expectdResult = {
         success: true,
         message: "Item removed from cart successfully.",
      };

      sRemoveFromCartMock.mockResolvedValue(expectdResult);

      const result = await removeFromCart(item.id);

      expect(result).toEqual(expectdResult);
      expect(sRemoveFromCartMock).toHaveBeenCalledTimes(1);
      expect(sRemoveFromCartMock).toHaveBeenCalledWith(item.id);
   });
});

describe("migrateSessionCartToUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("migrateSessionCartToUser - cart updated - test", async () => {
      const sessionCartId = "session-id-1";
      const userId = "user-id-1";

      await migrateSessionCartToUser(sessionCartId, userId);

      expect(sMigrateSessionCartToUserMock).toHaveBeenCalledTimes(1);
      expect(sMigrateSessionCartToUserMock).toHaveBeenCalledWith(
         sessionCartId,
         userId
      );
   });
});
