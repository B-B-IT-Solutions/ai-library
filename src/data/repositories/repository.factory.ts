import { DbClient } from "@/data/types/db/common";

import { CartRepository } from "./cart";
import { CatalogRepository, PublicCatalogRepository } from "./catalog";
import { CollectionRepository, PublicCollectionRepository } from "./collection";
import { OrderRepository } from "./order";
import { ProductRepository } from "./product";
import { PublicTemplateRepository, TemplateRepository } from "./prompt";
import { Prompt0Repository } from "./prompt0";
import { PublicSettingsRepository, SettingsRepository } from "./settings";
import { SubscriptionRepository } from "./subscription";
import {
   PasswordResetRepository,
   UserRepository,
   VerificationTokenRepository,
} from "./user";

export class RepositoryFactory {
   private prisma: DbClient;
   private catalogRepo?: CatalogRepository;
   private publicCatalogRepo?: PublicCatalogRepository;
   private userRepo?: UserRepository;
   private verificationTokenRepo?: VerificationTokenRepository;
   private passwordResetRepo?: PasswordResetRepository;
   private cartRepo?: CartRepository;
   private collectionRepo?: CollectionRepository;
   private publicCollectionRepo?: PublicCollectionRepository;
   private orderRepo?: OrderRepository;
   private productRepo?: ProductRepository;
   private prompt0Repo?: Prompt0Repository;
   private templateRepo?: TemplateRepository;
   private publicTemplateRepo?: PublicTemplateRepository;
   private subscriptionRepo?: SubscriptionRepository;
   private settingsRepo?: SettingsRepository;
   private publicSettingsRepo?: PublicSettingsRepository;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   userRepository(): UserRepository {
      if (!this.userRepo) {
         this.userRepo = new UserRepository(this.prisma);
      }
      return this.userRepo;
   }

   verificationTokenRepository(): VerificationTokenRepository {
      if (!this.verificationTokenRepo) {
         this.verificationTokenRepo = new VerificationTokenRepository(
            this.prisma
         );
      }
      return this.verificationTokenRepo;
   }

   passwordResetRepository(): PasswordResetRepository {
      if (!this.passwordResetRepo) {
         this.passwordResetRepo = new PasswordResetRepository(this.prisma);
      }
      return this.passwordResetRepo;
   }

   catalogRepository(): CatalogRepository {
      if (!this.catalogRepo) {
         this.catalogRepo = new CatalogRepository(this.prisma);
      }
      return this.catalogRepo;
   }

   publicCatalogRepository(): PublicCatalogRepository {
      if (!this.publicCatalogRepo) {
         this.publicCatalogRepo = new PublicCatalogRepository(this.prisma);
      }
      return this.publicCatalogRepo;
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

   prompt0Repository(): Prompt0Repository {
      if (!this.prompt0Repo) {
         this.prompt0Repo = new Prompt0Repository(this.prisma);
      }
      return this.prompt0Repo;
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

   publicSettingsRepository(): PublicSettingsRepository {
      if (!this.publicSettingsRepo) {
         this.publicSettingsRepo = new PublicSettingsRepository(this.prisma);
      }
      return this.publicSettingsRepo;
   }
}
