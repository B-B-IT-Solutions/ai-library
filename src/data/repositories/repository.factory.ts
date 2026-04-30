import { DbClient } from "@/data/types/db/common";

import { CartRepository } from "./cart";
import { CollectionRepository, PublicCollectionRepository } from "./collection";
import { OrderRepository } from "./order";
import { ProductRepository } from "./product";
import { PromptRepository } from "./prompt";
import { SettingsRepository } from "./settings";
import { SubscriptionRepository } from "./subscription";
import { PublicTemplateRepository, TemplateRepository } from "./template";
import { UserRepository } from "./user";

export class RepositoryFactory {
   private prisma: DbClient;
   private userRepo?: UserRepository;
   private cartRepo?: CartRepository;
   private collectionRepo?: CollectionRepository;
   private publicCollectionRepo?: PublicCollectionRepository;
   private orderRepo?: OrderRepository;
   private productRepo?: ProductRepository;
   private promptRepo?: PromptRepository;
   private templateRepo?: TemplateRepository;
   private publicTemplateRepo?: PublicTemplateRepository;
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

   publicCollectionRepository(): PublicCollectionRepository {
      if (!this.publicCollectionRepo) {
         this.publicCollectionRepo = new PublicCollectionRepository(
            this.prisma
         );
      }
      return this.publicCollectionRepo;
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

   templateRepository(): TemplateRepository {
      if (!this.templateRepo) {
         this.templateRepo = new TemplateRepository(this.prisma);
      }
      return this.templateRepo;
   }

   publicTemplateRepository(): PublicTemplateRepository {
      if (!this.publicTemplateRepo) {
         this.publicTemplateRepo = new PublicTemplateRepository(this.prisma);
      }
      return this.publicTemplateRepo;
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
