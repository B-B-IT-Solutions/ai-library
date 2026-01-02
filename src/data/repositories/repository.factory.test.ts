import { PrismaClient } from "@prisma/client";

import { CartRepository } from "./cart";
import { LibraryRepository } from "./library";
import { OrderRepository } from "./order";
import { ProductRepository } from "./product";
import { PromptRepository } from "./prompt";
import { RepositoryFactory } from "./repository.factory";

describe("RepositoryFactory tests", () => {
   let mockPrisma: PrismaClient;
   let factory: RepositoryFactory;

   beforeEach(() => {
      mockPrisma = {} as PrismaClient;
      factory = new RepositoryFactory(mockPrisma);
   });

   describe("cartRepository tests", () => {
      it("should create and return CartRepository instance", () => {
         const repository = factory.cartRepository();

         expect(repository).toBeInstanceOf(CartRepository);
      });

      it("should return the same instance on multiple calls (singleton pattern)", () => {
         const repository1 = factory.cartRepository();
         const repository2 = factory.cartRepository();

         expect(repository1).toBe(repository2);
      });
   });

   describe("libraryRepository tests", () => {
      it("should create and return LibraryRepository instance", () => {
         const repository = factory.libraryRepository();

         expect(repository).toBeInstanceOf(LibraryRepository);
      });

      it("should return the same instance on multiple calls (singleton pattern)", () => {
         const repository1 = factory.libraryRepository();
         const repository2 = factory.libraryRepository();

         expect(repository1).toBe(repository2);
      });
   });

   describe("orderRepository tests", () => {
      it("should create and return OrderRepository instance", () => {
         const repository = factory.orderRepository();

         expect(repository).toBeInstanceOf(OrderRepository);
      });

      it("should return the same instance on multiple calls (singleton pattern)", () => {
         const repository1 = factory.orderRepository();
         const repository2 = factory.orderRepository();

         expect(repository1).toBe(repository2);
      });
   });

   describe("productRepository tests", () => {
      it("should create and return ProductRepository instance", () => {
         const repository = factory.productRepository();

         expect(repository).toBeInstanceOf(ProductRepository);
      });

      it("should return the same instance on multiple calls (singleton pattern)", () => {
         const repository1 = factory.productRepository();
         const repository2 = factory.productRepository();

         expect(repository1).toBe(repository2);
      });
   });

   describe("promptRepository tests", () => {
      it("should create and return PromptRepository instance", () => {
         const repository = factory.promptRepository();
         expect(repository).toBeInstanceOf(PromptRepository);
      });

      it("should return the same instance on multiple calls (singleton pattern)", () => {
         const repository1 = factory.promptRepository();
         const repository2 = factory.promptRepository();

         expect(repository1).toBe(repository2);
      });
   });
});
