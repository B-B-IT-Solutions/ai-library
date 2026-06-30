import { DbClient } from "@/data/types/db/common";

import { AdminDashboardRepository } from "./admin/dashboard";
import { AdminSubscriptionPlanRepository } from "./admin/subscription-plan";
import { AdminUserRepository } from "./admin/user";
import { CartRepository } from "./cart";
import { CatalogRepository, PublicCatalogRepository } from "./catalog";
import { CollectionRepository, PublicCollectionRepository } from "./collection";
import { OrderRepository } from "./order";
import { ProductRepository, PublicProductRepository } from "./product";
import { PromptRepository, PublicPromptRepository } from "./prompt";
import { Prompt0Repository } from "./prompt0";
import { PublicSettingsRepository, SettingsRepository } from "./settings";
import { SubscriptionRepository } from "./subscription";
import {
   PasswordResetRepository,
   UserRepository,
   VerificationTokenRepository,
} from "./user";
import { WorkflowRepository } from "./workflow";

export class RepositoryFactory {
   private prisma: DbClient;
   private adminDashboardRepo?: AdminDashboardRepository;
   private adminUserRepo?: AdminUserRepository;
   private adminSubscriptionRepo?: AdminSubscriptionRepository;
   private adminSubscriptionPlanRepo?: AdminSubscriptionPlanRepository;
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
   private publicProductRepo?: PublicProductRepository;
   private prompt0Repo?: Prompt0Repository;
   private promptRepo?: PromptRepository;
   private publicPromptRepo?: PublicPromptRepository;
   private workflowRepo?: WorkflowRepository;
   private subscriptionRepo?: SubscriptionRepository;
   private settingsRepo?: SettingsRepository;
   private publicSettingsRepo?: PublicSettingsRepository;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   adminDashboardRepository(): AdminDashboardRepository {
      if (!this.adminDashboardRepo) {
         this.adminDashboardRepo = new AdminDashboardRepository(this.prisma);
      }
      return this.adminDashboardRepo;
   }

   adminSubscriptionPlanRepository(): AdminSubscriptionPlanRepository {
      if (!this.adminSubscriptionPlanRepo) {
         this.adminSubscriptionPlanRepo = new AdminSubscriptionPlanRepository(
            this.prisma
         );
      }
      return this.adminSubscriptionPlanRepo;
   }

   adminUserRepository(): AdminUserRepository {
      if (!this.adminUserRepo) {
         this.adminUserRepo = new AdminUserRepository(this.prisma);
      }
      return this.adminUserRepo;
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

   publicProductRepository(): PublicProductRepository {
      if (!this.publicProductRepo) {
         this.publicProductRepo = new PublicProductRepository(this.prisma);
      }
      return this.publicProductRepo;
   }

   prompt0Repository(): Prompt0Repository {
      if (!this.prompt0Repo) {
         this.prompt0Repo = new Prompt0Repository(this.prisma);
      }
      return this.prompt0Repo;
   }

   promptRepository(): PromptRepository {
      if (!this.promptRepo) {
         this.promptRepo = new PromptRepository(this.prisma);
      }
      return this.promptRepo;
   }

   publicPromptRepository(): PublicPromptRepository {
      if (!this.publicPromptRepo) {
         this.publicPromptRepo = new PublicPromptRepository(this.prisma);
      }
      return this.publicPromptRepo;
   }

   workflowRepository(): WorkflowRepository {
      if (!this.workflowRepo) {
         this.workflowRepo = new WorkflowRepository(this.prisma);
      }
      return this.workflowRepo;
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
