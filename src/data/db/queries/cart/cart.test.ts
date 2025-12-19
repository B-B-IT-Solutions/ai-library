import { PrismaClient } from "@prisma/client";
import { waitFor } from "@testing-library/dom";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import {
   CartCreateInput,
   CartFindFirstArgs,
   CartFindUniqueArgs,
   CartItemFindUniqueArgs,
} from "@/generated/prisma/models";

import {
   AddItemToCartParams,
   pAddItemToCart,
   pClearCart,
   pCreateCart,
   pGetCartBySessionId,
   pGetCartByUserId,
   pGetOrCreateCart,
   pMigrateSessionCartToUser,
   pRemoveCartItem,
} from "./cart";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("pGetOrCreateCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetOrCreateCart - userId defined - sessionCartId undefined - test", async () => {
      const fn = () => pGetOrCreateCart({});

      expect(fn).rejects.toThrow(Error);
      expect(prismaMock.cart.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.cart.findUnique).not.toHaveBeenCalled();
   });

   it("pGetOrCreateCart - userId defined - cart exists - test", async () => {
      const cart = ptestData.pCart();
      prismaMock.cart.findFirst.mockResolvedValue(cart);

      const userId = "user-1";

      const result = await pGetOrCreateCart({ userId });

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

   it("pGetOrCreateCart - userId defined - cart doesn't exist - test", async () => {
      const cart = ptestData.pCart();
      prismaMock.cart.findFirst.mockResolvedValue(null);
      prismaMock.cart.create.mockResolvedValue(cart);

      const userId = "user-1";

      const result = await pGetOrCreateCart({ userId });

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

      expect(result).toEqual(cart);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.create).toHaveBeenCalledWith(
         expectedCartCreateArgs
      );
   });

   it("pGetOrCreateCart - sessionCartId defined - cart exists - test", async () => {
      const cart = ptestData.pCart();
      prismaMock.cart.findUnique.mockResolvedValue(cart);

      const sessionCartId = "sessionCartId-1";

      const result = await pGetOrCreateCart({ sessionCartId });

      const expectedFindFirstArgs: CartFindFirstArgs = {
         where: { sessionCartId },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(cart);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   it("pGetOrCreateCart - sessionCartId defined - cart doesn't exist - test", async () => {
      const cart = ptestData.pCart();
      prismaMock.cart.findUnique.mockResolvedValue(null);
      prismaMock.cart.create.mockResolvedValue(cart);

      const sessionCartId = "sessionCartId-1";

      const result = await pGetOrCreateCart({ sessionCartId });

      const expectedCartCreateArgs = {
         data: {
            sessionCartId,
         },
         include: {
            items: true,
         },
      };

      expect(result).toEqual(cart);
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
      const result = await pGetCartByUserId(userId);

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
      const result = await pGetCartBySessionId(sessionCartId);

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

      await pCreateCart(createInput);

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

describe("pClearCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pClearCart test", async () => {
      const cartId = "cart-1";
      await pClearCart(cartId);

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

describe("pAddItemToCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pAddItemToCart - item doesn't exist - creates new item - test", async () => {
      const cartItem = ptestData.pCartItem();
      prismaMock.cartItem.findUnique.mockResolvedValue(null);
      prismaMock.cartItem.create.mockResolvedValue(cartItem);

      const params: AddItemToCartParams = {
         cartId: "cart-1",
         productId: "product-1",
         productName: "Product 1",
         productType: "TEMPLATE",
         productPrice: 29.99,
      };

      const result = await pAddItemToCart(params);

      const expectedFindUniqueArgs: CartItemFindUniqueArgs = {
         where: {
            cartId_productId: {
               cartId: params.cartId,
               productId: params.productId,
            },
         },
      };

      const expectedCreateArgs = {
         data: {
            cartId: params.cartId,
            productId: params.productId,
            productName: params.productName,
            productType: params.productType,
            productPrice: params.productPrice,
            quantity: 1,
         },
      };

      expect(result).toEqual(cartItem);
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
      const existingItem = ptestData.pCartItem();
      prismaMock.cartItem.findUnique.mockResolvedValue(existingItem);

      const params: AddItemToCartParams = {
         cartId: existingItem.cartId,
         productId: existingItem.productId,
         productName: existingItem.productName,
         productType: existingItem.productType,
         productPrice: Number(existingItem.productPrice),
      };

      const result = await pAddItemToCart(params);

      const expectedFindUniqueArgs: CartItemFindUniqueArgs = {
         where: {
            cartId_productId: {
               cartId: params.cartId,
               productId: params.productId,
            },
         },
      };

      expect(result).toEqual(existingItem);
      expect(prismaMock.cartItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cartItem.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
      expect(prismaMock.cartItem.create).not.toHaveBeenCalled();
   });

   it("pAddItemToCart - with BUNDLE product type - test", async () => {
      const cartItem = ptestData.pCartItem();
      prismaMock.cartItem.findUnique.mockResolvedValue(null);
      prismaMock.cartItem.create.mockResolvedValue(cartItem);

      const params: AddItemToCartParams = {
         cartId: "cart-1",
         productId: "product-bundle-1",
         productName: "Bundle Product",
         productType: "BUNDLE",
         productPrice: 59.99,
      };

      const result = await pAddItemToCart(params);

      const expectedCreateArgs = {
         data: {
            cartId: params.cartId,
            productId: params.productId,
            productName: params.productName,
            productType: "BUNDLE",
            productPrice: params.productPrice,
            quantity: 1,
         },
      };

      expect(result).toEqual(cartItem);
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

      const result = await pRemoveCartItem(item.id);

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

      await expect(pRemoveCartItem(itemId)).rejects.toThrow("Record not found");
      expect(prismaMock.cartItem.delete).toHaveBeenCalledTimes(1);
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

      const result = await pMigrateSessionCartToUser(sessionCartId, userId);

      expect(result).toEqual(updatedCart);
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

      const result = await pMigrateSessionCartToUser(sessionCartId, userId);

      expect(result).toBeNull();
      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
         where: { sessionCartId },
      });
      expect(prismaMock.cart.deleteMany).not.toHaveBeenCalled();
      expect(prismaMock.cart.update).not.toHaveBeenCalled();
   });
});
