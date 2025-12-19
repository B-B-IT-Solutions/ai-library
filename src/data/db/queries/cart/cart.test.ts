import { PrismaClient } from "@prisma/client";
import { waitFor } from "@testing-library/dom";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import {
   CartCreateInput,
   CartFindFirstArgs,
   CartFindUniqueArgs,
} from "@/generated/prisma/models";

import {
   pClearCart,
   pCreateCart,
   pGetCartBySessionId,
   pGetCartByUserId,
   pGetOrCreateCart,
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
