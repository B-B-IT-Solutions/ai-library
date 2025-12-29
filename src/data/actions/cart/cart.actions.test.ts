jest.mock("@/auth");
jest.mock("@/data/db/queries/cart");
jest.mock("@/data/actions/auth-utils");

import { AuthMockedFunction, dtestData, ntestData, ptestData } from "@tests";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { CartRepository } from "@/data/db/queries/cart";
import { BatchPayload } from "@/generated/prisma/internal/prismaNamespace";

import {
   addToCart,
   clearCart,
   getCart,
   migrateSessionCartToUser,
   removeFromCart,
} from "./cart.actions";
import { toDCart } from "./cart.mapper";

const pGetOrCreateCart = CartRepository.prototype.pGetOrCreateCart;
const pAddItemToCart = CartRepository.prototype.pAddItemToCart;
const pRemoveCartItem = CartRepository.prototype.pRemoveCartItem;
const pClearCart = CartRepository.prototype.pClearCart;
const pMigrateSessionCartToUser = CartRepository.prototype.pMigrateSessionCartToUser;

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

const pMigrateSessionCartToUserMock =
   pMigrateSessionCartToUser as jest.MockedFunction<
      typeof pMigrateSessionCartToUser
   >;

describe("getCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
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
      jest.clearAllMocks();
   });

   it("addToCart - success - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const item = ptestData.pCartItem();
      const product = dtestData.dProduct();

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pAddItemToCartMock.mockResolvedValue(item);

      const result = await addToCart(product);

      const expectedParams = {
         cartId: cart.id,
         productId: product.id,
         productName: product.name,
         productType: product.type,
         productPrice: product.price,
      };

      const expectdResult = {
         success: true,
         message: "Item added to cart successfully.",
      };

      expect(result).toEqual(expectdResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({
         userId: session.user.id,
      });
      expect(pAddItemToCartMock).toHaveBeenCalledTimes(1);
      expect(pAddItemToCartMock).toHaveBeenCalledWith(expectedParams);
   });

   it("addToCart - error - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const product = dtestData.dProduct();
      const errorMessage = "Database error";
      const error = new Error(errorMessage);

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pAddItemToCartMock.mockRejectedValue(error);

      const result = await addToCart(product);

      const expectdResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectdResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({
         userId: session.user.id,
      });
      expect(pAddItemToCartMock).toHaveBeenCalledTimes(1);
   });

   it("addToCart - getCart throws error - test", async () => {
      const product = dtestData.dProduct();
      const errorMessage = "Cart not found";
      const error = new Error(errorMessage);

      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      pGetOrCreateCartMock.mockRejectedValue(error);

      const result = await addToCart(product);

      const expectdResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectdResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({});
      expect(pAddItemToCartMock).not.toHaveBeenCalled();
   });
});

describe("removeFromCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("removeFromCart - success - test", async () => {
      const item = ptestData.pCartItem();
      pRemoveCartItemMock.mockResolvedValue(item);

      const result = await removeFromCart(item.id);

      const expectdResult = {
         success: true,
         message: "Item removed from cart successfully.",
      };

      expect(result).toEqual(expectdResult);
      expect(pRemoveCartItemMock).toHaveBeenCalledTimes(1);
      expect(pRemoveCartItemMock).toHaveBeenCalledWith(item.id);
   });

   it("removeFromCart - error - test", async () => {
      const item = ptestData.pCartItem();
      const errorMessage = "Item not found";
      const error = new Error(errorMessage);

      pRemoveCartItemMock.mockRejectedValue(error);

      const result = await removeFromCart(item.id);

      const expectdResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectdResult);
      expect(pRemoveCartItemMock).toHaveBeenCalledTimes(1);
      expect(pRemoveCartItemMock).toHaveBeenCalledWith(item.id);
   });

   it("removeFromCart - database error - test", async () => {
      const item = ptestData.pCartItem();
      const error = {
         name: "PrismaClientKnownRequestError",
         code: "P2025",
         message: "Record to delete does not exist.",
      };

      pRemoveCartItemMock.mockRejectedValue(error);

      const result = await removeFromCart(item.id);

      const expectdResult = {
         success: false,
         message: "Record to delete does not exist.",
      };

      expect(result).toEqual(expectdResult);
      expect(pRemoveCartItemMock).toHaveBeenCalledTimes(1);
   });
});

describe("clearCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("clearCart - success - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const batchPayload: BatchPayload = { count: cart.items.length };

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pClearCartMock.mockResolvedValue(batchPayload);

      const result = await clearCart();

      const expectedResult = {
         success: true,
         message: "Cart cleared successfully.",
      };

      expect(result).toEqual(expectedResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({
         userId: session.user.id,
      });
      expect(pClearCartMock).toHaveBeenCalledTimes(1);
      expect(pClearCartMock).toHaveBeenCalledWith(cart.id);
   });

   it("clearCart - error - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const errorMessage = "Failed to clear cart";
      const error = new Error(errorMessage);

      authMock.mockResolvedValue(session);
      pGetOrCreateCartMock.mockResolvedValue(cart);
      pClearCartMock.mockRejectedValue(error);

      const result = await clearCart();

      const expectedResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({
         userId: session.user.id,
      });
      expect(pClearCartMock).toHaveBeenCalledTimes(1);
      expect(pClearCartMock).toHaveBeenCalledWith(cart.id);
   });

   it("clearCart - getCart throws error - test", async () => {
      const errorMessage = "Cart not found";
      const error = new Error(errorMessage);

      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      pGetOrCreateCartMock.mockRejectedValue(error);

      const result = await clearCart();

      const expectdResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectdResult);
      expect(pGetOrCreateCartMock).toHaveBeenCalledTimes(1);
      expect(pGetOrCreateCartMock).toHaveBeenCalledWith({});
      expect(pClearCartMock).not.toHaveBeenCalled();
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

      expect(pMigrateSessionCartToUserMock).toHaveBeenCalledTimes(1);
      expect(pMigrateSessionCartToUserMock).toHaveBeenCalledWith(
         sessionCartId,
         userId
      );
   });
});
