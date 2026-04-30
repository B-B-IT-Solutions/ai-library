import { RepositoryFactory } from "@/data/repositories";
import { CartService } from "@/data/services/cart";
import {
   CollectionService,
   PublicCollectionService,
} from "@/data/services/collection";
import { IubendaService } from "@/data/services/iubenda";
import { OrderService } from "@/data/services/order";
import { PromptService } from "@/data/services/prompt";
import { SettingsService } from "@/data/services/settings";
import { StripeService } from "@/data/services/stripe";
import { SubscriptionService } from "@/data/services/subscription";
import {
   PublicTemplateService,
   TemplateService,
} from "@/data/services/template";
import { UserService } from "@/data/services/user";
import { DbClient } from "@/data/types/db/common";

export class ServiceFactory {
   private repositories: RepositoryFactory;
   private userService?: UserService;
   private cartService?: CartService;
   private collectionService?: CollectionService;
   private publicCollectionService?: PublicCollectionService;
   private orderService?: OrderService;
   private stripeService?: StripeService;
   private subscriptionService?: SubscriptionService;
   private promptService?: PromptService;
   private templateService?: TemplateService;
   private publicTemplateService?: PublicTemplateService;
   private settingsService?: SettingsService;
   private iubendaService?: IubendaService;

   constructor(prisma: DbClient) {
      this.repositories = new RepositoryFactory(prisma);
   }

   getUserService(): UserService {
      if (!this.userService) {
         this.userService = new UserService(
            this.repositories.userRepository(),
            this.getCartService(),
            this.getOrderService(),
            this.getIubendaService()
         );
      }
      return this.userService;
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

   getPromptService(): PromptService {
      if (!this.promptService) {
         this.promptService = new PromptService(
            this.repositories.promptRepository()
         );
      }
      return this.promptService;
   }

   getTemplateService(): TemplateService {
      if (!this.templateService) {
         this.templateService = new TemplateService(
            this.repositories.templateRepository(),
            this.getSettingsService()
         );
      }
      return this.templateService;
   }

   getPublicTemplateService(): PublicTemplateService {
      if (!this.publicTemplateService) {
         this.publicTemplateService = new PublicTemplateService(
            this.repositories.publicTemplateRepository(),
            this.getPublicCollectionService()
         );
      }
      return this.publicTemplateService;
   }

   getSubscriptionService(): SubscriptionService {
      if (!this.subscriptionService) {
         this.subscriptionService = new SubscriptionService(
            this.repositories.subscriptionRepository()
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

   getIubendaService(): IubendaService {
      if (!this.iubendaService) {
         this.iubendaService = new IubendaService();
      }
      return this.iubendaService;
   }
}
