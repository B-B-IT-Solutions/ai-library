jest.mock("@/auth");
jest.mock("@/data/db/queries/cart");
jest.mock("@/data/actions/auth-utils");

import { AuthMockedFunction, dtestData, ntestData, ptestData } from "@tests";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import {
   pAddItemToCart,
   pClearCart,
   pGetOrCreateCart,
   pRemoveCartItem,
} from "@/data/db/queries/cart";

import { addToCart, clearCart, getCart, removeFromCart } from "./cart.actions";
import { toDCart } from "./cart.mapper";

const authMock = auth as unknown as AuthMockedFunction;
const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;

const pGetOrCreateCartMock = pGetOrCreateCart as jest.MockedFunction<
   typeof pGetOrCreateCart
>;

const pAddItemToCartMock = pAddItemToCart as jest.MockedFunction<
   typeof pAddItemToCart
>;

const pRemoveCartItemMock = pRemoveCartItem as jest.MockedFunction<
   typeof pRemoveCartItem
>;

const pClearCartMock = pClearCart as jest.MockedFunction<typeof pClearCart>;

describe("getCart tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getCart - session null - sessionCartId null - test", async () => {
      pGetOrCreateCartMock.mockRejectedValue(
         new Error("invalid userId and sessionCartId")
      );
      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);

      const fn = () => getCart();

      await expect(fn).rejects.toThrow(Error);
      expect(cookiesMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({});
   });

   it("getCart - session.user undefined- sessionCartId defined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      const cart = ptestData.pCartWithItems();
      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);

      const cookies = { sessionCartId: "sessionCartId-1" };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await getCart();
      const expectResult = toDCart(cart);

      const expectedParams = { sessionCartId: cookies.sessionCartId };

      expect(result).toEqual(expectResult);
      expect(cookiesMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith(expectedParams);
   });

   it("getCart - session.user.id undefined- sessionCartId defined - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      const cart = ptestData.pCartWithItems();
      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);

      const cookies = { sessionCartId: "sessionCartId-1" };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await getCart();
      const expectResult = toDCart(cart);

      const expectedParams = { sessionCartId: cookies.sessionCartId };

      expect(result).toEqual(expectResult);
      expect(cookiesMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith(expectedParams);
   });

   it("getCart - session.user defined - sessionCartId undefined - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);

      const cookies = { sessionCartId: "sessionCartId-1" };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await getCart();
      const expectResult = toDCart(cart);

      const expectedParams = { userId: session.user.id };

      expect(result).toEqual(expectResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith(expectedParams);
      expect(cookiesMock).not.toHaveBeenCalled();
   });
});

describe("addToCart tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("addToCart - success - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const product = dtestData.dProduct();

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pAddItemToCartMock.mockResolvedValue(undefined);

      const result = await addToCart(product);

      const expectedParams = {
         cartId: toDCart(cart).id,
         productId: product.id,
         productName: product.name,
         productType: product.type,
         productPrice: product.price,
      };

      expect(result).toEqual({
         success: true,
         message: "Item added to cart successfully.",
      });
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pAddItemToCartMock).toHaveBeenCalledTimes(1);
      expect(pAddItemToCartMock).toHaveBeenCalledWith(expectedParams);
   });

   it("addToCart - error - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const product = dtestData.dProduct();
      const errorMessage = "Database error";

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pAddItemToCartMock.mockRejectedValue(new Error(errorMessage));

      const result = await addToCart(product);

      expect(result).toEqual({
         success: false,
         message: errorMessage,
      });
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pAddItemToCartMock).toHaveBeenCalledTimes(1);
   });

   it("addToCart - getCart throws error - test", async () => {
      const product = dtestData.dProduct();
      const errorMessage = "Cart not found";

      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      pGetOrCreateCartMock.mockRejectedValue(new Error(errorMessage));

      const result = await addToCart(product);

      expect(result).toEqual({
         success: false,
         message: errorMessage,
      });
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pAddItemToCartMock).not.toHaveBeenCalled();
   });
});

describe("removeFromCart tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("removeFromCart - success - test", async () => {
      const itemId = "item-123";
      pRemoveCartItemMock.mockResolvedValue(undefined);

      const result = await removeFromCart(itemId);

      expect(result).toEqual({
         success: true,
         message: "Item removed from cart successfully.",
      });
      expect(pRemoveCartItemMock).toHaveBeenCalledTimes(1);
      expect(pRemoveCartItemMock).toHaveBeenCalledWith(itemId);
   });

   it("removeFromCart - error - test", async () => {
      const itemId = "item-123";
      const errorMessage = "Item not found";

      pRemoveCartItemMock.mockRejectedValue(new Error(errorMessage));

      const result = await removeFromCart(itemId);

      expect(result).toEqual({
         success: false,
         message: errorMessage,
      });
      expect(pRemoveCartItemMock).toHaveBeenCalledTimes(1);
      expect(pRemoveCartItemMock).toHaveBeenCalledWith(itemId);
   });

   it("removeFromCart - database error - test", async () => {
      const itemId = "item-456";
      const error = {
         name: "PrismaClientKnownRequestError",
         code: "P2025",
         message: "Record to delete does not exist.",
      };

      pRemoveCartItemMock.mockRejectedValue(error);

      const result = await removeFromCart(itemId);

      expect(result).toEqual({
         success: false,
         message: "Record to delete does not exist.",
      });
      expect(pRemoveCartItemMock).toHaveBeenCalledTimes(1);
   });
});

describe("clearCart tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("clearCart - success - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pClearCartMock.mockResolvedValue(undefined);

      const result = await clearCart();

      expect(result).toEqual({
         success: true,
         message: "Cart cleared successfully.",
      });
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pClearCartMock).toHaveBeenCalledTimes(1);
      expect(pClearCartMock).toHaveBeenCalledWith(toDCart(cart).id);
   });

   it("clearCart - error - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const errorMessage = "Failed to clear cart";

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pClearCartMock.mockRejectedValue(new Error(errorMessage));

      const result = await clearCart();

      expect(result).toEqual({
         success: false,
         message: errorMessage,
      });
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pClearCartMock).toHaveBeenCalledTimes(1);
   });

   it("clearCart - getCart throws error - test", async () => {
      const errorMessage = "Cart not found";

      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      pGetOrCreateCartMock.mockRejectedValue(new Error(errorMessage));

      const result = await clearCart();

      expect(result).toEqual({
         success: false,
         message: errorMessage,
      });
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pClearCartMock).not.toHaveBeenCalled();
   });
});
