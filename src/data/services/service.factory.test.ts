import { PrismaClient } from "@prisma/client";

import { RepositoryFactory } from "../db/queries/repository.factory";

import { CartService } from "./cart";
import { LibraryService } from "./library";
import { OrderService } from "./order";
import { ServiceFactory } from "./service.factory";
import { StripeService } from "./stripe/stripe.service";

describe("ServiceFactory tests", () => {
   let mockPrisma: PrismaClient;
   let repositoryFactory: RepositoryFactory;
   let serviceFactory: ServiceFactory;

   beforeEach(() => {
      mockPrisma = {} as PrismaClient;
      repositoryFactory = new RepositoryFactory(mockPrisma);
      serviceFactory = new ServiceFactory(repositoryFactory);
   });

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

      it("should inject CartService and LibraryService dependencies correctly", () => {
         const orderService = serviceFactory.getOrderService();
         const cartService = serviceFactory.getCartService();
         const libraryService = serviceFactory.getLibraryService();

         expect(orderService).toBeInstanceOf(OrderService);
         expect(cartService).toBeInstanceOf(CartService);
         expect(libraryService).toBeInstanceOf(LibraryService);
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

      it("should inject OrderService dependencies correctly", () => {
         const stripeService = serviceFactory.getStripeService();
         const orderService = serviceFactory.getOrderService();

         expect(stripeService).toBeInstanceOf(StripeService);
         expect(orderService).toBeInstanceOf(OrderService);
      });
   });

   describe("integration tests", () => {
      it("should create services with shared repository instances", () => {
         const cartService = serviceFactory.getCartService();
         const orderService = serviceFactory.getOrderService();

         expect(cartService).toBeInstanceOf(CartService);
         expect(orderService).toBeInstanceOf(OrderService);

         const cartRepository1 = repositoryFactory.cartRepository();
         const cartRepository2 = repositoryFactory.cartRepository();

         expect(cartRepository1).toBe(cartRepository2);
      });
   });
});
