import { PrismaClient } from "@prisma/client";
import { waitFor } from "@testing-library/dom";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   CartCreateInput,
   CartDeleteManyArgs,
   CartFindFirstArgs,
   CartFindUniqueArgs,
   CartItemCreateArgs,
   CartItemCreateInput,
   CartItemFindUniqueArgs,
} from "@/generated/prisma/models";

import { CartRepository } from "./cart.repository";
import { toDCart, toDCartItem } from "./cart.mapper";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const cartRepository = new CartRepository(prismaMock);

describe("pGetOrCreateCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetOrCreateCart - userId defined - sessionCartId undefined - test", async () => {
      const fn = () => cartRepository.pGetOrCreateCart({});

      expect(fn).rejects.toThrow(Error);
      expect(prismaMock.cart.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.cart.findUnique).not.toHaveBeenCalled();
   });

   it("pGetOrCreateCart - userId defined - cart exists - test", async () => {
      const cart = ptestData.pCartWithItems();
      prismaMock.cart.findFirst.mockResolvedValue(cart);

      const userId = "user-1";

      const result = await cartRepository.pGetOrCreateCart({ userId });

      const expectedResult = toDCart(cart);

      const expectedFindFirstArgs: CartFindFirstArgs = {
         where: { userId },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   it("pGetOrCreateCart - userId defined - cart doesn't exist - test", async () => {
      const cart = ptestData.pCartWithItems();
      prismaMock.cart.findFirst.mockResolvedValue(null);
      prismaMock.cart.create.mockResolvedValue(cart);

      const userId = "user-1";

      const result = await cartRepository.pGetOrCreateCart({ userId });

      const expectedResult = toDCart(cart);

      const expectedCartCreateArgs = {
         data: {
            user: {
               connect: { id: "user-1" },
            },
         },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.create).toHaveBeenCalledWith(
         expectedCartCreateArgs
      );
   });

   it("pGetOrCreateCart - sessionCartId defined - cart exists - test", async () => {
      const cart = ptestData.pCartWithItems();
      prismaMock.cart.findUnique.mockResolvedValue(cart);

      const sessionCartId = "sessionCartId-1";

      const result = await cartRepository.pGetOrCreateCart({ sessionCartId });

      const expectedResult = toDCart(cart);

      const expectedFindFirstArgs: CartFindFirstArgs = {
         where: { sessionCartId },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   it("pGetOrCreateCart - sessionCartId defined - cart doesn't exist - test", async () => {
      const cart = ptestData.pCartWithItems();
      prismaMock.cart.findUnique.mockResolvedValue(null);
      prismaMock.cart.create.mockResolvedValue(cart);

      const sessionCartId = "sessionCartId-1";

      const result = await cartRepository.pGetOrCreateCart({ sessionCartId });

      const expectedResult = toDCart(cart);

      const expectedCartCreateArgs = {
         data: {
            sessionCartId,
         },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.create).toHaveBeenCalledWith(
         expectedCartCreateArgs
      );
   });
});

describe("pGetCartByUserId tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetCartByUserId test", async () => {
      const cart = ptestData.pCart();
      prismaMock.cart.findFirst.mockResolvedValue(cart);

      const userId = "1";
      const result = await cartRepository.pGetCartByUserId(userId);

      const expectedFindFirstArgs: CartFindFirstArgs = {
         where: { userId },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(cart);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });
});

describe("pGetCartBySessionId tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetCartBySessionId test", async () => {
      const cart = ptestData.pCart();
      prismaMock.cart.findUnique.mockResolvedValue(cart);

      const sessionCartId = "sessionCartId-1";
      const result = await cartRepository.pGetCartBySessionId(sessionCartId);

      const expectedFindUniqueArgs: CartFindUniqueArgs = {
         where: { sessionCartId },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(cart);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pCreateCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pCreateCart test", async () => {
      const createInput: CartCreateInput = {
         user: { connect: { id: "user-1" } },
      };

      await cartRepository.pCreateCart(createInput);

      const expectedCartCreateArgs = {
         data: createInput,
         include: {
            items: true,
         },
      };

      await waitFor(() => {
         expect(prismaMock.cart.create).toHaveBeenCalledTimes(1);
         expect(prismaMock.cart.create).toHaveBeenCalledWith(
            expectedCartCreateArgs
         );
      });
   });
});

describe("pAddItemToCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pAddItemToCart - item doesn't exist - creates new item - test", async () => {
      const cartId = "cart-id-1";
      const cartItem = ptestData.pCartItem();
      prismaMock.cartItem.findUnique.mockResolvedValue(null);
      prismaMock.cartItem.create.mockResolvedValue(cartItem);

      const product = dtestData.dProduct();

      const result = await cartRepository.pAddItemToCart(cartId, product);

      const expectedResult = toDCartItem(cartItem);

      const expectedFindUniqueArgs: CartItemFindUniqueArgs = {
         where: {
            cartId_productId: {
               cartId: cartId,
               productId: product.id,
            },
         },
      };

      const expectedInput: CartItemCreateInput = {
         productName: product.name,
         productType: product.type,
         productPrice: product.price,
         quantity: 1,
         cart: {
            connect: {
               id: cartId,
            },
         },
         product: {
            connect: {
               id: product.id,
            },
         },
      };

      const expectedCreateArgs: CartItemCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.cartItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cartItem.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
      expect(prismaMock.cartItem.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.cartItem.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });

   it("pAddItemToCart - item exists - returns existing item - test", async () => {
      const cartId = "cart-id-1";
      const existingItem = ptestData.pCartItem();
      prismaMock.cartItem.findUnique.mockResolvedValue(existingItem);

      const product = dtestData.dProduct();

      const result = await cartRepository.pAddItemToCart(cartId, product);

      const expectedResult = toDCartItem(existingItem);

      const expectedFindUniqueArgs: CartItemFindUniqueArgs = {
         where: {
            cartId_productId: {
               cartId: cartId,
               productId: product.id,
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.cartItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cartItem.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
      expect(prismaMock.cartItem.create).not.toHaveBeenCalled();
   });

   it("pAddItemToCart - with BUNDLE product type - test", async () => {
      const cartId = "cart-id-1";
      const cartItem = ptestData.pCartItem();
      prismaMock.cartItem.findUnique.mockResolvedValue(null);
      prismaMock.cartItem.create.mockResolvedValue(cartItem);

      const product = dtestData.dProduct();

      const result = await cartRepository.pAddItemToCart(cartId, product);

      const expectedResult = toDCartItem(cartItem);

      const expectedInput: CartItemCreateInput = {
         productName: product.name,
         productType: product.type,
         productPrice: product.price,
         quantity: 1,
         cart: {
            connect: {
               id: cartId,
            },
         },
         product: {
            connect: {
               id: product.id,
            },
         },
      };

      const expectedCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.cartItem.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});

describe("pRemoveCartItem tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pRemoveCartItem - success - test", async () => {
      const item = ptestData.pCartItem();
      prismaMock.cartItem.delete.mockResolvedValue(item);

      const result = await cartRepository.pRemoveCartItem(item.id);

      const expectedDeleteArgs = {
         where: { id: item.id },
      };

      expect(result).toEqual(item);
      expect(prismaMock.cartItem.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.cartItem.delete).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
   });

   it("pRemoveCartItem - item not found - throws error - test", async () => {
      const error = new Error("Record not found");
      prismaMock.cartItem.delete.mockRejectedValue(error);

      const itemId = "non-existent-item";

      await expect(cartRepository.pRemoveCartItem(itemId)).rejects.toThrow(
         "Record not found"
      );
      expect(prismaMock.cartItem.delete).toHaveBeenCalledTimes(1);
   });
});

describe("pClearCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pClearCart test", async () => {
      const cartId = "cart-1";
      await cartRepository.pClearCart(cartId);

      const expectedDeleteManyArgs = {
         where: { cartId },
      };

      await waitFor(() => {
         expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledTimes(1);
         expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledWith(
            expectedDeleteManyArgs
         );
      });
   });
});

describe("pDeleteCarts tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pDeleteCarts test", async () => {
      const userId = "user-id-1";
      await cartRepository.pDeleteCarts(userId);

      const expectedDeleteManyArgs: CartDeleteManyArgs = {
         where: { userId },
      };

      await waitFor(() => {
         expect(prismaMock.cart.deleteMany).toHaveBeenCalledTimes(1);
         expect(prismaMock.cart.deleteMany).toHaveBeenCalledWith(
            expectedDeleteManyArgs
         );
      });
   });
});

describe("pMigrateSessionCartToUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pMigrateSessionCartToUser - session cart exists - migrates successfully - test", async () => {
      const sessionCart = ptestData.pCart();
      sessionCart.sessionCartId = "session-123";
      sessionCart.userId = null;

      const updatedCart = {
         ...sessionCart,
         userId: "user-1",
         sessionCartId: null,
      };

      prismaMock.cart.findUnique.mockResolvedValue(sessionCart);
      prismaMock.cart.deleteMany.mockResolvedValue({ count: 1 });
      prismaMock.cart.update.mockResolvedValue(updatedCart);

      const sessionCartId = "session-123";
      const userId = "user-1";

      await cartRepository.pMigrateSessionCartToUser(sessionCartId, userId);

      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
         where: { sessionCartId },
      });
      expect(prismaMock.cart.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.deleteMany).toHaveBeenCalledWith({
         where: { userId },
      });
      expect(prismaMock.cart.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.update).toHaveBeenCalledWith({
         where: { id: sessionCart.id },
         data: {
            userId,
            sessionCartId: null,
         },
      });
   });

   it("pMigrateSessionCartToUser - session cart not found - returns null - test", async () => {
      prismaMock.cart.findUnique.mockResolvedValue(null);

      const sessionCartId = "non-existent-session";
      const userId = "user-1";

      await cartRepository.pMigrateSessionCartToUser(sessionCartId, userId);

      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
         where: { sessionCartId },
      });
      expect(prismaMock.cart.deleteMany).not.toHaveBeenCalled();
      expect(prismaMock.cart.update).not.toHaveBeenCalled();
   });
});
