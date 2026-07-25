import { RepositoryFactory } from "@/data/repositories";
import { CartService } from "@/data/services/cart";
import { CatalogService, PublicCatalogService } from "@/data/services/catalog";
import {
   CollectionService,
   PublicCollectionService,
} from "@/data/services/collection";
import {
   BrevoEmailService,
   IEmailService,
   SmtpEmailService,
} from "@/data/services/email";
import { IubendaService } from "@/data/services/iubenda";
import { OrderService } from "@/data/services/order";
import { PublicProductService } from "@/data/services/product";
import { PromptService, PublicPromptService } from "@/data/services/prompt";
import {
   PublicSettingsService,
   SettingsService,
} from "@/data/services/settings";
import { StripeService } from "@/data/services/stripe";
import { SubscriptionService } from "@/data/services/subscription";
import {
   PasswordResetService,
   UserService,
   VerificationTokenService,
} from "@/data/services/user";
import { WorkflowService } from "@/data/services/workflow";
import { DbClient } from "@/data/types/db/common";
import { EMAIL_PROVIDER } from "@/lib/constants";

import { AdminDashboardService } from "./admin/dashboard";
import { AdminSubscriptionPlanService } from "./admin/subscription-plan";
import { AdminUserService } from "./admin/user";

export class ServiceFactory {
   private repositories: RepositoryFactory;
   private adminDashboardService?: AdminDashboardService;
   private adminSubscriptionPlanService?: AdminSubscriptionPlanService;
   private adminUserService?: AdminUserService;
   private catalogService?: CatalogService;
   private publicCatalogService?: PublicCatalogService;
   private userService?: UserService;
   private verificationTokenService?: VerificationTokenService;
   private passwordResetService?: PasswordResetService;
   private cartService?: CartService;
   private collectionService?: CollectionService;
   private publicCollectionService?: PublicCollectionService;
   private orderService?: OrderService;
   private productService?: PublicProductService;
   private stripeService?: StripeService;
   private subscriptionService?: SubscriptionService;
   private promptService?: PromptService;
   private publicPromptService?: PublicPromptService;
   private workflowService?: WorkflowService;
   private settingsService?: SettingsService;
   private publicSettingsService?: PublicSettingsService;
   private iubendaService?: IubendaService;
   private emailService?: IEmailService;

   constructor(prisma: DbClient) {
      this.repositories = new RepositoryFactory(prisma);
   }

   getAdminDashboardService(): AdminDashboardService {
      if (!this.adminDashboardService) {
         this.adminDashboardService = new AdminDashboardService(
            this.repositories.adminDashboardRepository()
         );
      }
      return this.adminDashboardService;
   }

   getAdminSubscriptionPlanService(): AdminSubscriptionPlanService {
      if (!this.adminSubscriptionPlanService) {
         this.adminSubscriptionPlanService = new AdminSubscriptionPlanService(
            this.repositories.adminSubscriptionPlanRepository()
         );
      }
      return this.adminSubscriptionPlanService;
   }

   getAdminUserService(): AdminUserService {
      if (!this.adminUserService) {
         this.adminUserService = new AdminUserService(
            this.repositories.adminUserRepository()
         );
      }
      return this.adminUserService;
   }

   getUserService(): UserService {
      if (!this.userService) {
         this.userService = new UserService(
            this.repositories.userRepository(),
            this.getVerificationTokenService(),
            this.getPasswordResetService(),
            this.getCartService(),
            this.getOrderService(),
            this.getIubendaService()
         );
      }
      return this.userService;
   }

   getVerificationTokenService(): VerificationTokenService {
      if (!this.verificationTokenService) {
         this.verificationTokenService = new VerificationTokenService(
            this.repositories.verificationTokenRepository(),
            this.getEmailService()
         );
      }
      return this.verificationTokenService;
   }

   getPasswordResetService(): PasswordResetService {
      if (!this.passwordResetService) {
         this.passwordResetService = new PasswordResetService(
            this.repositories.passwordResetRepository(),
            this.getEmailService()
         );
      }
      return this.passwordResetService;
   }

   getCatalogService(): CatalogService {
      if (!this.catalogService) {
         this.catalogService = new CatalogService(
            this.repositories.catalogRepository(),
            this.getPromptService()
         );
      }
      return this.catalogService;
   }

   getPublicCatalogService(): PublicCatalogService {
      if (!this.publicCatalogService) {
         this.publicCatalogService = new PublicCatalogService(
            this.repositories.publicCatalogRepository()
         );
      }
      return this.publicCatalogService;
   }

   getCartService(): CartService {
      if (!this.cartService) {
         this.cartService = new CartService(this.repositories.cartRepository());
      }
      return this.cartService;
   }

   getCollectionService(): CollectionService {
      if (!this.collectionService) {
         this.collectionService = new CollectionService(
            this.repositories.collectionRepository()
         );
      }
      return this.collectionService;
   }

   getPublicCollectionService(): PublicCollectionService {
      if (!this.publicCollectionService) {
         this.publicCollectionService = new PublicCollectionService(
            this.repositories.publicCollectionRepository()
         );
      }
      return this.publicCollectionService;
   }

   getOrderService(): OrderService {
      if (!this.orderService) {
         this.orderService = new OrderService(
            this.repositories.orderRepository(),
            this.getCartService(),
            this.getCollectionService()
         );
      }
      return this.orderService;
   }

   getPublicProductService(): PublicProductService {
      if (!this.productService) {
         this.productService = new PublicProductService(
            this.repositories.publicProductRepository()
         );
      }
      return this.productService;
   }

   getPromptService(): PromptService {
      if (!this.promptService) {
         this.promptService = new PromptService(
            this.repositories.promptRepository(),
            this.getSettingsService(),
            this.getSubscriptionService(),
            this.getCollectionService()
         );
      }
      return this.promptService;
   }

   getPublicPromptService(): PublicPromptService {
      if (!this.publicPromptService) {
         this.publicPromptService = new PublicPromptService(
            this.repositories.publicPromptRepository(),
            this.getPublicCollectionService(),
            this.getPublicSettingsService()
         );
      }
      return this.publicPromptService;
   }

   getWorkflowService(): WorkflowService {
      if (!this.workflowService) {
         this.workflowService = new WorkflowService(
            this.repositories.workflowRepository(),
            this.getSubscriptionService()
         );
      }
      return this.workflowService;
   }

   getSubscriptionService(): SubscriptionService {
      if (!this.subscriptionService) {
         this.subscriptionService = new SubscriptionService(
            this.repositories.subscriptionRepository(),
            this.getUserService()
         );
      }
      return this.subscriptionService;
   }

   getStripeService(): StripeService {
      if (!this.stripeService) {
         this.stripeService = new StripeService(
            this.getCartService(),
            this.getOrderService(),
            this.getSubscriptionService(),
            this.getUserService()
         );
      }
      return this.stripeService;
   }

   getSettingsService(): SettingsService {
      if (!this.settingsService) {
         this.settingsService = new SettingsService(
            this.repositories.settingsRepository()
         );
      }
      return this.settingsService;
   }

   getPublicSettingsService(): PublicSettingsService {
      if (!this.publicSettingsService) {
         this.publicSettingsService = new PublicSettingsService(
            this.repositories.publicSettingsRepository()
         );
      }
      return this.publicSettingsService;
   }

   getIubendaService(): IubendaService {
      if (!this.iubendaService) {
         this.iubendaService = new IubendaService();
      }
      return this.iubendaService;
   }

   getEmailService(): IEmailService {
      if (!this.emailService) {
         if (EMAIL_PROVIDER === "SMTP") {
            this.emailService = new SmtpEmailService();
         } else {
            this.emailService = new BrevoEmailService();
         }
      }
      return this.emailService;
   }
}
