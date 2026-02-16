jest.mock("@/auth");
jest.mock("@/data/repositories/cart");
jest.mock("../../actions/auth-utils");

import { AuthMockedFunction, dtestData, ntestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { CartRepository } from "@/data/repositories/cart";
import prisma from "@/data/repositories/prisma";

import { toDCart } from "./cart.mapper";
import { CartService } from "./cart.service";

const authMock = auth as unknown as AuthMockedFunction;
const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;

const cartRepo = new CartRepository(prisma);
const cartRepoMock = cartRepo as DeepMockProxy<CartRepository>;

const cartService = new CartService(cartRepoMock);

describe("getCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCart - session null - sessionCartId null - test", async () => {
      cartRepoMock.pGetOrCreateCart.mockRejectedValue(
         new Error("invalid userId and sessionCartId")
      );
      authMock.mockResolvedValue(null);
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);

      const fn = () => cartService.getCart();

      await expect(fn).rejects.toThrow(Error);
      expect(cookiesMock).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledWith({});
   });

   it("getCart - session.user undefined- sessionCartId defined - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      const cart = ptestData.pCartWithItems();
      authMock.mockResolvedValue(session);
      cartRepoMock.pGetOrCreateCart.mockResolvedValue(cart);

      const cookies = { sessionCartId: "sessionCartId-1" };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await cartService.getCart();
      const expectResult = toDCart(cart);

      const expectedParams = { sessionCartId: cookies.sessionCartId };

      expect(result).toEqual(expectResult);
      expect(cookiesMock).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledWith(
         expectedParams
      );
   });

   it("getCart - session.user.id undefined- sessionCartId defined - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      const cart = ptestData.pCartWithItems();
      authMock.mockResolvedValue(session);
      cartRepoMock.pGetOrCreateCart.mockResolvedValue(cart);

      const cookies = { sessionCartId: "sessionCartId-1" };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await cartService.getCart();
      const expectResult = toDCart(cart);

      const expectedParams = { sessionCartId: cookies.sessionCartId };

      expect(result).toEqual(expectResult);
      expect(cookiesMock).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledWith(
         expectedParams
      );
   });

   it("getCart - session.user defined - sessionCartId undefined - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      authMock.mockResolvedValue(session);
      cartRepoMock.pGetOrCreateCart.mockResolvedValue(cart);

      const cookies = { sessionCartId: "sessionCartId-1" };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);

      const result = await cartService.getCart();
      const expectResult = toDCart(cart);

      const expectedParams = { userId: session.user.id };

      expect(result).toEqual(expectResult);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledWith(
         expectedParams
      );
      expect(cookiesMock).not.toHaveBeenCalled();
   });
});

describe("addToCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("addToCart - test", async () => {
      const session = ntestData.session();
      const cart = ptestData.pCartWithItems();
      const item = ptestData.pCartItem();
      const product = dtestData.dProduct();

      authMock.mockResolvedValue(session);
      cartRepoMock.pGetOrCreateCart.mockResolvedValue(cart);
      cartRepoMock.pAddItemToCart.mockResolvedValue(item);

      await cartService.addToCart(product);

      const expectedParams = {
         cartId: cart.id,
         productId: product.id,
         productName: product.name,
         productType: product.type,
         productPrice: product.price,
      };

      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetOrCreateCart).toHaveBeenCalledWith({
         userId: session.user.id,
      });
      expect(cartRepoMock.pAddItemToCart).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pAddItemToCart).toHaveBeenCalledWith(expectedParams);
   });
});

describe("removeFromCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("removeFromCart - success - test", async () => {
      const item = ptestData.pCartItem();
      cartRepoMock.pRemoveCartItem.mockResolvedValue(item);

      const result = await cartService.removeFromCart(item.id);

      const expectdResult = {
         success: true,
         message: "Item removed from cart successfully.",
      };

      expect(result).toEqual(expectdResult);
      expect(cartRepoMock.pRemoveCartItem).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pRemoveCartItem).toHaveBeenCalledWith(item.id);
   });

   it("removeFromCart - error - test", async () => {
      const item = ptestData.pCartItem();
      const errorMessage = "Item not found";
      const error = new Error(errorMessage);

      cartRepoMock.pRemoveCartItem.mockRejectedValue(error);

      const result = await cartService.removeFromCart(item.id);

      const expectdResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectdResult);
      expect(cartRepoMock.pRemoveCartItem).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pRemoveCartItem).toHaveBeenCalledWith(item.id);
   });

   it("removeFromCart - database error - test", async () => {
      const item = ptestData.pCartItem();
      const error = {
         name: "PrismaClientKnownRequestError",
         code: "P2025",
         message: "Record to delete does not exist.",
      };

      cartRepoMock.pRemoveCartItem.mockRejectedValue(error);

      const result = await cartService.removeFromCart(item.id);

      const expectdResult = {
         success: false,
         message: "Record to delete does not exist.",
      };

      expect(result).toEqual(expectdResult);
      expect(cartRepoMock.pRemoveCartItem).toHaveBeenCalledTimes(1);
   });
});

describe("clearCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("clearCart - cart null - test", async () => {
      const userId = "user-id-1";

      cartRepoMock.pGetCartByUserId.mockResolvedValue(null);

      await cartService.clearCart(userId);

      expect(cartRepoMock.pGetCartByUserId).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepoMock.pClearCart).not.toHaveBeenCalled();
   });

   it("clearCart - cart exists - test", async () => {
      const userId = "user-id-1";
      const cart = ptestData.pCartWithItems();
      cartRepoMock.pGetCartByUserId.mockResolvedValue(cart);

      await cartService.clearCart(userId);

      expect(cartRepoMock.pGetCartByUserId).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pGetCartByUserId).toHaveBeenCalledWith(userId);
      expect(cartRepoMock.pClearCart).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pClearCart).toHaveBeenCalledWith(cart.id);
   });
});

describe("deleteCarts tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteCarts - carts deleted - test", async () => {
      const userId = "user-id-1";

      await cartService.deleteCarts(userId);

      expect(cartRepoMock.pDeleteCarts).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pDeleteCarts).toHaveBeenCalledWith(userId);
   });
});

describe("migrateSessionCartToUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("migrateSessionCartToUser - cart updated - test", async () => {
      const sessionCartId = "session-id-1";
      const userId = "user-id-1";

      await cartService.migrateSessionCartToUser(sessionCartId, userId);

      expect(cartRepoMock.pMigrateSessionCartToUser).toHaveBeenCalledTimes(1);
      expect(cartRepoMock.pMigrateSessionCartToUser).toHaveBeenCalledWith(
         sessionCartId,
         userId
      );
   });
});
