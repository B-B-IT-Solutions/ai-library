import { PrismaClient } from "@prisma/client";

import { CartRepository } from "./cart";
import { CollectionRepository, PublicCollectionRepository } from "./collection";
import { OrderRepository } from "./order";
import { ProductRepository } from "./product";
import { PromptRepository } from "./prompt";
import { PromptTemplateRepository, PublicTemplateRepository } from "./template";
import { RepositoryFactory } from "./repository.factory";
import { SettingsRepository } from "./settings";
import { SubscriptionRepository } from "./subscription";
import { UserRepository } from "./user";

describe("RepositoryFactory tests", () => {
   let mockPrisma: PrismaClient;
   let factory: RepositoryFactory;

   beforeEach(() => {
      mockPrisma = {} as PrismaClient;
      factory = new RepositoryFactory(mockPrisma);
   });

   describe("userRepository tests", () => {
      it("userRepository - new instance - test", () => {
         const repository = factory.userRepository();
         expect(repository).toBeInstanceOf(UserRepository);
      });

      it("userRepository - existing instance - test", () => {
         const repository1 = factory.userRepository();
         const repository2 = factory.userRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("cartRepository tests", () => {
      it("cartRepository - new instance - test", () => {
         const repository = factory.cartRepository();
         expect(repository).toBeInstanceOf(CartRepository);
      });

      it("cartRepository - existing instance - test", () => {
         const repository1 = factory.cartRepository();
         const repository2 = factory.cartRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("collectionRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.collectionRepository();
         expect(repository).toBeInstanceOf(CollectionRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.collectionRepository();
         const repository2 = factory.collectionRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("publicCollectionRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.publicCollectionRepository();
         expect(repository).toBeInstanceOf(PublicCollectionRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.publicCollectionRepository();
         const repository2 = factory.publicCollectionRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("orderRepository tests", () => {
      it("orderRepository - new instance - test", () => {
         const repository = factory.orderRepository();
         expect(repository).toBeInstanceOf(OrderRepository);
      });

      it("orderRepository - existing instance - test", () => {
         const repository1 = factory.orderRepository();
         const repository2 = factory.orderRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("productRepository tests", () => {
      it("productRepository - new instance - test", () => {
         const repository = factory.productRepository();
         expect(repository).toBeInstanceOf(ProductRepository);
      });

      it("productRepository - existing instance - test", () => {
         const repository1 = factory.productRepository();
         const repository2 = factory.productRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("promptRepository tests", () => {
      it("promptRepository - new instance - test", () => {
         const repository = factory.promptRepository();
         expect(repository).toBeInstanceOf(PromptRepository);
      });

      it("promptRepository - existing instance - test", () => {
         const repository1 = factory.promptRepository();
         const repository2 = factory.promptRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("templateRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.templateRepository();
         expect(repository).toBeInstanceOf(PromptTemplateRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.templateRepository();
         const repository2 = factory.templateRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("publicTemplateRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.publicTemplateRepository();
         expect(repository).toBeInstanceOf(PublicTemplateRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.publicTemplateRepository();
         const repository2 = factory.publicTemplateRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("subscriptionRepository tests", () => {
      it("subscriptionRepository - new instance - test", () => {
         const repository = factory.subscriptionRepository();
         expect(repository).toBeInstanceOf(SubscriptionRepository);
      });

      it("subscriptionRepository - existing instance - test", () => {
         const repository1 = factory.subscriptionRepository();
         const repository2 = factory.subscriptionRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("settingsRepository tests", () => {
      it("settingsRepository - new instance - test", () => {
         const repository = factory.settingsRepository();
         expect(repository).toBeInstanceOf(SettingsRepository);
      });

      it("settingsRepository - existing instance - test", () => {
         const repository1 = factory.settingsRepository();
         const repository2 = factory.settingsRepository();
         expect(repository1).toBe(repository2);
      });
   });
});
