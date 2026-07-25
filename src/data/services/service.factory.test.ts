import prisma from "@/data/repositories/prisma";

import { AdminDashboardService } from "./admin/dashboard";
import { AdminSubscriptionPlanService } from "./admin/subscription-plan";
import { AdminUserService } from "./admin/user";
import { CartService } from "./cart";
import { CatalogService, PublicCatalogService } from "./catalog";
import { CollectionService, PublicCollectionService } from "./collection";
import { IubendaService } from "./iubenda";
import { OrderService } from "./order";
import { PublicProductService } from "./product";
import { PromptService, PublicPromptService } from "./prompt";
import { ServiceFactory } from "./service.factory";
import { PublicSettingsService, SettingsService } from "./settings";
import { StripeService } from "./stripe/stripe.service";
import { SubscriptionService } from "./subscription";
import {
   PasswordResetService,
   UserService,
   VerificationTokenService,
} from "./user";
import { WorkflowService } from "./workflow";

const serviceFactory = new ServiceFactory(prisma);

describe("getAdminDashboardService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getAdminDashboardService();
      expect(service).toBeInstanceOf(AdminDashboardService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getAdminDashboardService();
      const service2 = serviceFactory.getAdminDashboardService();
      expect(service1).toBe(service2);
   });
});

describe("getAdminSubscriptionPlanService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getAdminSubscriptionPlanService();
      expect(service).toBeInstanceOf(AdminSubscriptionPlanService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getAdminSubscriptionPlanService();
      const service2 = serviceFactory.getAdminSubscriptionPlanService();
      expect(service1).toBe(service2);
   });
});

describe("getAdminUserService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getAdminUserService();
      expect(service).toBeInstanceOf(AdminUserService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getAdminUserService();
      const service2 = serviceFactory.getAdminUserService();
      expect(service1).toBe(service2);
   });
});

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

describe("getVerificationTokenService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getVerificationTokenService();
      expect(service).toBeInstanceOf(VerificationTokenService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getVerificationTokenService();
      const service2 = serviceFactory.getVerificationTokenService();
      expect(service1).toBe(service2);
   });
});

describe("getPasswordResetService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPasswordResetService();
      expect(service).toBeInstanceOf(PasswordResetService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPasswordResetService();
      const service2 = serviceFactory.getPasswordResetService();
      expect(service1).toBe(service2);
   });
});

describe("getCatalogService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getCatalogService();
      expect(service).toBeInstanceOf(CatalogService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getCatalogService();
      const service2 = serviceFactory.getCatalogService();
      expect(service1).toBe(service2);
   });
});

describe("getPublicCatalogService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPublicCatalogService();
      expect(service).toBeInstanceOf(PublicCatalogService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPublicCatalogService();
      const service2 = serviceFactory.getPublicCatalogService();
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

describe("getPublicProductService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPublicProductService();
      expect(service).toBeInstanceOf(PublicProductService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPublicProductService();
      const service2 = serviceFactory.getPublicProductService();
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

describe("getPublicPromptService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getPublicPromptService();
      expect(service).toBeInstanceOf(PublicPromptService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getPublicPromptService();
      const service2 = serviceFactory.getPublicPromptService();
      expect(service1).toBe(service2);
   });
});

describe("getWorkflowService tests", () => {
   it("new instance - test", () => {
      const service = serviceFactory.getWorkflowService();
      expect(service).toBeInstanceOf(WorkflowService);
   });

   it("existing instance - test", () => {
      const service1 = serviceFactory.getWorkflowService();
      const service2 = serviceFactory.getWorkflowService();
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

describe("getEmailService tests", () => {
   describe("EMAIL_PROVIDER - SMTP - tests", () => {
      beforeEach(() => {
         process.env.EMAIL_PROVIDER = "SMTP";
         process.env.SMTP_HOST = "localhost";
         process.env.SMTP_PORT = "1025";
         process.env.SMTP_FROM = "noreply@localhost";
      });

      afterEach(() => {
         delete process.env.EMAIL_PROVIDER;
         delete process.env.SMTP_HOST;
         delete process.env.SMTP_PORT;
         delete process.env.SMTP_FROM;
      });

      it("new Instance - test", () => {
         jest.isolateModules(() => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { ServiceFactory } = require("./service.factory");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { SmtpEmailService } = require("./email");
            const factory = new ServiceFactory(prisma);
            const service = factory.getEmailService();
            expect(service).toBeInstanceOf(SmtpEmailService);
         });
      });

      it("existing instance - test", () => {
         jest.isolateModules(() => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { ServiceFactory } = require("./service.factory");
            const factory = new ServiceFactory(prisma);
            const service1 = factory.getEmailService();
            const service2 = factory.getEmailService();
            expect(service1).toBe(service2);
         });
      });
   });

   describe("EMAIL_PROVIDER - BREVO - tests", () => {
      beforeEach(() => {
         process.env.EMAIL_PROVIDER = "BREVO";
      });

      afterEach(() => {
         delete process.env.EMAIL_PROVIDER;
      });

      it("new Instance - test", () => {
         jest.isolateModules(() => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { ServiceFactory } = require("./service.factory");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { BrevoEmailService } = require("./email");
            const factory = new ServiceFactory(prisma);
            const service = factory.getEmailService();
            expect(service).toBeInstanceOf(BrevoEmailService);
         });
      });

      it("existing instance - test", () => {
         jest.isolateModules(() => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { ServiceFactory } = require("./service.factory");
            const factory = new ServiceFactory(prisma);
            const service1 = factory.getEmailService();
            const service2 = factory.getEmailService();
            expect(service1).toBe(service2);
         });
      });
   });

   describe("EMAIL_PROVIDER null  tests", () => {
      beforeEach(() => {
         process.env.EMAIL_PROVIDER = undefined;
      });

      afterEach(() => {
         delete process.env.EMAIL_PROVIDER;
      });

      it("new Instance - test", () => {
         jest.isolateModules(() => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { ServiceFactory } = require("./service.factory");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { BrevoEmailService } = require("./email");
            const factory = new ServiceFactory(prisma);
            const service = factory.getEmailService();
            expect(service).toBeInstanceOf(BrevoEmailService);
         });
      });

      it("existing instance - test", () => {
         jest.isolateModules(() => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { ServiceFactory } = require("./service.factory");
            const factory = new ServiceFactory(prisma);
            const service1 = factory.getEmailService();
            const service2 = factory.getEmailService();
            expect(service1).toBe(service2);
         });
      });
   });
});
