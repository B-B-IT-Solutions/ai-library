import prisma from "@/data/repositories/prisma";

import { CartService } from "./cart";
import { LibraryService } from "./library";
import { OrderService } from "./order";
import { PromptService } from "./prompt";
import { PromptTemplateService } from "./prompt-template";
import { ServiceFactory } from "./service.factory";
import { SettingsService } from "./settings";
import { StripeService } from "./stripe/stripe.service";
import { SubscriptionService } from "./subscription";
import { UserService } from "./user";

const serviceFactory = new ServiceFactory(prisma);

describe("getUserService tests", () => {
   it("getUserService - new instance - test", () => {
      const service = serviceFactory.getUserService();
      expect(service).toBeInstanceOf(UserService);
   });

   it("getUserService - existing instance - test", () => {
      const service1 = serviceFactory.getUserService();
      const service2 = serviceFactory.getUserService();
      expect(service1).toBe(service2);
   });
});

describe("getCartService tests", () => {
   it("getCartService - new instance - test", () => {
      const service = serviceFactory.getCartService();
      expect(service).toBeInstanceOf(CartService);
   });

   it("getCartService - existing instance - test", () => {
      const service1 = serviceFactory.getCartService();
      const service2 = serviceFactory.getCartService();
      expect(service1).toBe(service2);
   });
});

describe("getLibraryService tests", () => {
   it("getLibraryService - new instance - test", () => {
      const service = serviceFactory.getLibraryService();
      expect(service).toBeInstanceOf(LibraryService);
   });

   it("getLibraryService - existing instance - test", () => {
      const service1 = serviceFactory.getLibraryService();
      const service2 = serviceFactory.getLibraryService();
      expect(service1).toBe(service2);
   });
});

describe("getOrderService tests", () => {
   it("getOrderService - new instance - test", () => {
      const service = serviceFactory.getOrderService();
      expect(service).toBeInstanceOf(OrderService);
   });

   it("getOrderService - existing instance - test", () => {
      const service1 = serviceFactory.getOrderService();
      const service2 = serviceFactory.getOrderService();
      expect(service1).toBe(service2);
   });
});

describe("getPromptService tests", () => {
   it("getPromptService - new instance - test", () => {
      const service = serviceFactory.getPromptService();
      expect(service).toBeInstanceOf(PromptService);
   });

   it("getPromptService - existing instance - test", () => {
      const service1 = serviceFactory.getPromptService();
      const service2 = serviceFactory.getPromptService();
      expect(service1).toBe(service2);
   });
});

describe("getPromptTemplateService tests", () => {
   it("getPromptTemplateService - new instance - test", () => {
      const service = serviceFactory.getPromptTemplateService();
      expect(service).toBeInstanceOf(PromptTemplateService);
   });

   it("getPromptTemplateService - existing instance - test", () => {
      const service1 = serviceFactory.getPromptTemplateService();
      const service2 = serviceFactory.getPromptTemplateService();
      expect(service1).toBe(service2);
   });
});

describe("getSubscriptionService tests", () => {
   it("getSubscriptionService - new instance - test", () => {
      const service = serviceFactory.getSubscriptionService();
      expect(service).toBeInstanceOf(SubscriptionService);
   });

   it("getSubscriptionService - existing instance - test", () => {
      const service1 = serviceFactory.getSubscriptionService();
      const service2 = serviceFactory.getSubscriptionService();
      expect(service1).toBe(service2);
   });
});

describe("getStripeService tests", () => {
   it("getStripeService - new instance - test", () => {
      const service = serviceFactory.getStripeService();
      expect(service).toBeInstanceOf(StripeService);
   });

   it("getStripeService - existing instance - test", () => {
      const service1 = serviceFactory.getStripeService();
      const service2 = serviceFactory.getStripeService();
      expect(service1).toBe(service2);
   });
});

describe("getSettingsService tests", () => {
   it("getSettingsService - new instance - test", () => {
      const service = serviceFactory.getSettingsService();
      expect(service).toBeInstanceOf(SettingsService);
   });

   it("getSettingsService - existing instance - test", () => {
      const service1 = serviceFactory.getSettingsService();
      const service2 = serviceFactory.getSettingsService();
      expect(service1).toBe(service2);
   });
});
