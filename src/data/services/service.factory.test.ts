import prisma from "@/data/repositories/prisma";

import { CartService } from "./cart";
import { LibraryService } from "./library";
import { OrderService } from "./order";
import { PromptService } from "./prompt";
import { ServiceFactory } from "./service.factory";
import { StripeService } from "./stripe/stripe.service";

const serviceFactory = new ServiceFactory(prisma);

describe("getCartService tests", () => {
   it("should create and return CartService instance", () => {
      const service = serviceFactory.getCartService();

      expect(service).toBeInstanceOf(CartService);
   });

   it("should return the same instance on multiple calls (singleton pattern)", () => {
      const service1 = serviceFactory.getCartService();
      const service2 = serviceFactory.getCartService();

      expect(service1).toBe(service2);
   });
});

describe("getLibraryService tests", () => {
   it("should create and return LibraryService instance", () => {
      const service = serviceFactory.getLibraryService();

      expect(service).toBeInstanceOf(LibraryService);
   });

   it("should return the same instance on multiple calls (singleton pattern)", () => {
      const service1 = serviceFactory.getLibraryService();
      const service2 = serviceFactory.getLibraryService();

      expect(service1).toBe(service2);
   });
});

describe("getOrderService tests", () => {
   it("should create and return OrderService instance", () => {
      const service = serviceFactory.getOrderService();

      expect(service).toBeInstanceOf(OrderService);
   });

   it("should return the same instance on multiple calls (singleton pattern)", () => {
      const service1 = serviceFactory.getOrderService();
      const service2 = serviceFactory.getOrderService();

      expect(service1).toBe(service2);
   });
});

describe("getStripeService tests", () => {
   it("should create and return StripeService instance", () => {
      const service = serviceFactory.getStripeService();

      expect(service).toBeInstanceOf(StripeService);
   });

   it("should return the same instance on multiple calls (singleton pattern)", () => {
      const service1 = serviceFactory.getStripeService();
      const service2 = serviceFactory.getStripeService();

      expect(service1).toBe(service2);
   });
});

describe("getPromptService tests", () => {
   it("should create and return PromptService instance", () => {
      const service = serviceFactory.getPromptService();

      expect(service).toBeInstanceOf(PromptService);
   });

   it("should return the same instance on multiple calls (singleton pattern)", () => {
      const service1 = serviceFactory.getPromptService();
      const service2 = serviceFactory.getPromptService();

      expect(service1).toBe(service2);
   });
});
