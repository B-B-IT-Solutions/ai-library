import prisma from "@/data/repositories/prisma";

import { CartService } from "./cart";
import { CollectionService, PublicCollectionService } from "./collection";
import { IubendaService } from "./iubenda";
import { OrderService } from "./order";
import { PromptService } from "./prompt";
import { ServiceFactory } from "./service.factory";
import { PublicSettingsService, SettingsService } from "./settings";
import { StripeService } from "./stripe/stripe.service";
import { SubscriptionService } from "./subscription";
import { PublicTemplateService, TemplateService } from "./template";
import { UserService } from "./user";

const serviceFactory = new ServiceFactory(prisma);

describe("getUserService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getUserService();
      expect(service).toBeInstanceOf(UserService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getUserService();
      const service2 = serviceFactory.getUserService();
      expect(service1).toBe(service2);
   });
});

describe("getCartService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getCartService();
      expect(service).toBeInstanceOf(CartService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getCartService();
      const service2 = serviceFactory.getCartService();
      expect(service1).toBe(service2);
   });
});

describe("getCollectionService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getCollectionService();
      expect(service).toBeInstanceOf(CollectionService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getCollectionService();
      const service2 = serviceFactory.getCollectionService();
      expect(service1).toBe(service2);
   });
});

describe("getPublicCollectionService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPublicCollectionService();
      expect(service).toBeInstanceOf(PublicCollectionService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPublicCollectionService();
      const service2 = serviceFactory.getPublicCollectionService();
      expect(service1).toBe(service2);
   });
});

describe("getOrderService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getOrderService();
      expect(service).toBeInstanceOf(OrderService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getOrderService();
      const service2 = serviceFactory.getOrderService();
      expect(service1).toBe(service2);
   });
});

describe("getPromptService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPromptService();
      expect(service).toBeInstanceOf(PromptService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPromptService();
      const service2 = serviceFactory.getPromptService();
      expect(service1).toBe(service2);
   });
});

describe("getTemplateService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getTemplateService();
      expect(service).toBeInstanceOf(TemplateService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getTemplateService();
      const service2 = serviceFactory.getTemplateService();
      expect(service1).toBe(service2);
   });
});

describe("getPublicTemplateService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPublicTemplateService();
      expect(service).toBeInstanceOf(PublicTemplateService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPublicTemplateService();
      const service2 = serviceFactory.getPublicTemplateService();
      expect(service1).toBe(service2);
   });
});

describe("getSubscriptionService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getSubscriptionService();
      expect(service).toBeInstanceOf(SubscriptionService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getSubscriptionService();
      const service2 = serviceFactory.getSubscriptionService();
      expect(service1).toBe(service2);
   });
});

describe("getStripeService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getStripeService();
      expect(service).toBeInstanceOf(StripeService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getStripeService();
      const service2 = serviceFactory.getStripeService();
      expect(service1).toBe(service2);
   });
});

describe("getSettingsService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getSettingsService();
      expect(service).toBeInstanceOf(SettingsService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getSettingsService();
      const service2 = serviceFactory.getSettingsService();
      expect(service1).toBe(service2);
   });
});

describe("getPublicSettingsService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPublicSettingsService();
      expect(service).toBeInstanceOf(PublicSettingsService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPublicSettingsService();
      const service2 = serviceFactory.getPublicSettingsService();
      expect(service1).toBe(service2);
   });
});

describe("getIubendaService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getIubendaService();
      expect(service).toBeInstanceOf(IubendaService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getIubendaService();
      const service2 = serviceFactory.getIubendaService();
      expect(service1).toBe(service2);
   });
});
