import { DbClient } from "@/data/types/db/common";

import { CartRepository } from "./cart";
import { CollectionRepository } from "./collection";
import { OrderRepository } from "./order";
import { ProductRepository } from "./product";
import { PromptRepository } from "./prompt";
import { PromptTemplateRepository } from "./prompt-template";
import { SettingsRepository } from "./settings";
import { SubscriptionRepository } from "./subscription";
import { UserRepository } from "./user";

export class RepositoryFactory {
   private prisma: DbClient;
   private userRepo?: UserRepository;
   private cartRepo?: CartRepository;
   private collectionRepo?: CollectionRepository;
   private orderRepo?: OrderRepository;
   private productRepo?: ProductRepository;
   private promptRepo?: PromptRepository;
   private promptTemplateRepos?: PromptTemplateRepository;
   private subscriptionRepo?: SubscriptionRepository;
   private settingsRepo?: SettingsRepository;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   userRepository(): UserRepository {
      if (!this.userRepo) {
         this.userRepo = new UserRepository(this.prisma);
      }
      return this.userRepo;
   }

   cartRepository(): CartRepository {
      if (!this.cartRepo) {
         this.cartRepo = new CartRepository(this.prisma);
      }
      return this.cartRepo;
   }

   collectionRepository(): CollectionRepository {
      if (!this.collectionRepo) {
         this.collectionRepo = new CollectionRepository(this.prisma);
      }
      return this.collectionRepo;
   }

   orderRepository(): OrderRepository {
      if (!this.orderRepo) {
         this.orderRepo = new OrderRepository(this.prisma);
      }
      return this.orderRepo;
   }

   productRepository(): ProductRepository {
      if (!this.productRepo) {
         this.productRepo = new ProductRepository(this.prisma);
      }
      return this.productRepo;
   }

   promptRepository(): PromptRepository {
      if (!this.promptRepo) {
         this.promptRepo = new PromptRepository(this.prisma);
      }
      return this.promptRepo;
   }

   promptTemplateRepository(): PromptTemplateRepository {
      if (!this.promptTemplateRepos) {
         this.promptTemplateRepos = new PromptTemplateRepository(this.prisma);
      }
      return this.promptTemplateRepos;
   }

   subscriptionRepository(): SubscriptionRepository {
      if (!this.subscriptionRepo) {
         this.subscriptionRepo = new SubscriptionRepository(this.prisma);
      }
      return this.subscriptionRepo;
   }

   settingsRepository(): SettingsRepository {
      if (!this.settingsRepo) {
         this.settingsRepo = new SettingsRepository(this.prisma);
      }
      return this.settingsRepo;
   }
}
