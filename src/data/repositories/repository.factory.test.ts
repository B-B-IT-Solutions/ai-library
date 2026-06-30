import { PrismaClient } from "@prisma/client";

import { AdminDashboardRepository } from "./admin/dashboard";
import { AdminSubscriptionPlanRepository } from "./admin/subscription-plan";
import { CartRepository } from "./cart";
import { CatalogRepository, PublicCatalogRepository } from "./catalog";
import { CollectionRepository, PublicCollectionRepository } from "./collection";
import { OrderRepository } from "./order";
import { ProductRepository, PublicProductRepository } from "./product";
import { PromptRepository, PublicPromptRepository } from "./prompt";
import { Prompt0Repository } from "./prompt0";
import { RepositoryFactory } from "./repository.factory";
import { PublicSettingsRepository, SettingsRepository } from "./settings";
import { SubscriptionRepository } from "./subscription";
import {
   PasswordResetRepository,
   UserRepository,
   VerificationTokenRepository,
} from "./user";
import { WorkflowRepository } from "./workflow";

describe("RepositoryFactory tests", () => {
   let mockPrisma: PrismaClient;
   let factory: RepositoryFactory;

   beforeEach(() => {
      mockPrisma = {} as PrismaClient;
      factory = new RepositoryFactory(mockPrisma);
   });

   describe("adminDashboardRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.adminDashboardRepository();
         expect(repository).toBeInstanceOf(AdminDashboardRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.adminDashboardRepository();
         const repository2 = factory.adminDashboardRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("adminSubscriptionPlanRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.adminSubscriptionPlanRepository();
         expect(repository).toBeInstanceOf(AdminSubscriptionPlanRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.adminSubscriptionPlanRepository();
         const repository2 = factory.adminSubscriptionPlanRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("userRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.userRepository();
         expect(repository).toBeInstanceOf(UserRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.userRepository();
         const repository2 = factory.userRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("verificationTokenRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.verificationTokenRepository();
         expect(repository).toBeInstanceOf(VerificationTokenRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.verificationTokenRepository();
         const repository2 = factory.verificationTokenRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("passwordResetRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.passwordResetRepository();
         expect(repository).toBeInstanceOf(PasswordResetRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.passwordResetRepository();
         const repository2 = factory.passwordResetRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("catalogRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.catalogRepository();
         expect(repository).toBeInstanceOf(CatalogRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.catalogRepository();
         const repository2 = factory.catalogRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("publicCatalogRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.publicCatalogRepository();
         expect(repository).toBeInstanceOf(PublicCatalogRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.publicCatalogRepository();
         const repository2 = factory.publicCatalogRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("cartRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.cartRepository();
         expect(repository).toBeInstanceOf(CartRepository);
      });

      it("existing instance - test", () => {
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
      it("new instance - test", () => {
         const repository = factory.orderRepository();
         expect(repository).toBeInstanceOf(OrderRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.orderRepository();
         const repository2 = factory.orderRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("productRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.productRepository();
         expect(repository).toBeInstanceOf(ProductRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.productRepository();
         const repository2 = factory.productRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("publicProductRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.publicProductRepository();
         expect(repository).toBeInstanceOf(PublicProductRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.publicProductRepository();
         const repository2 = factory.publicProductRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("prompt0Repository tests", () => {
      it("new instance - test", () => {
         const repository = factory.prompt0Repository();
         expect(repository).toBeInstanceOf(Prompt0Repository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.prompt0Repository();
         const repository2 = factory.prompt0Repository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("promptRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.promptRepository();
         expect(repository).toBeInstanceOf(PromptRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.promptRepository();
         const repository2 = factory.promptRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("publicPromptRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.publicPromptRepository();
         expect(repository).toBeInstanceOf(PublicPromptRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.publicPromptRepository();
         const repository2 = factory.publicPromptRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("workflowRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.workflowRepository();
         expect(repository).toBeInstanceOf(WorkflowRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.workflowRepository();
         const repository2 = factory.workflowRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("subscriptionRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.subscriptionRepository();
         expect(repository).toBeInstanceOf(SubscriptionRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.subscriptionRepository();
         const repository2 = factory.subscriptionRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("settingsRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.settingsRepository();
         expect(repository).toBeInstanceOf(SettingsRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.settingsRepository();
         const repository2 = factory.settingsRepository();
         expect(repository1).toBe(repository2);
      });
   });

   describe("publicSettingsRepository tests", () => {
      it("new instance - test", () => {
         const repository = factory.publicSettingsRepository();
         expect(repository).toBeInstanceOf(PublicSettingsRepository);
      });

      it("existing instance - test", () => {
         const repository1 = factory.publicSettingsRepository();
         const repository2 = factory.publicSettingsRepository();
         expect(repository1).toBe(repository2);
      });
   });
});
