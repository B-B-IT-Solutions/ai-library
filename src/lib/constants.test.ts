import {
   APP_DESCRIPTION,
   APP_NAME,
   INIT_PAGE_NUMBER,
   PAGE_SIZE,
   STRIPE_SECRET_KEY,
   STRIPE_WEBHOOK_SECRET,
} from "./constants";

describe("constants - static values - tests", () => {
   it("constants - APP_NAME resolves from env - test", () => {
      expect(APP_NAME).toEqual("Vision Notes");
   });

   it("constants - APP_DESCRIPTION resolves from env - test", () => {
      expect(APP_DESCRIPTION).toEqual(
         "Deine persönliche Bibliothek für KI-Prompts. Erstelle, organisiere und entdecke Prompts für alle gängigen KI-Tools – und hole endlich mehr aus deinen KI-Anwendungen heraus."
      );
   });

   it("constants - STRIPE_WEBHOOK_SECRET resolves from env - test", () => {
      expect(STRIPE_WEBHOOK_SECRET).toEqual(
         "0o3d0b4S9CeARjPD9QnK3xgq96a7esuI4nxtLZEWNSk="
      );
   });

   it("constants - STRIPE_SECRET_KEY resolves from env - test", () => {
      expect(STRIPE_SECRET_KEY).toEqual(
         "sk_test_0o3d0b4S9CeARjPD9QnK3xgq96a7esuI4nxtLZEWNSk"
      );
   });

   it("constants - INIT_PAGE_NUMBER is 0 - test", () => {
      expect(INIT_PAGE_NUMBER).toEqual(0);
   });

   it("constants - PAGE_SIZE is 10 - test", () => {
      expect(PAGE_SIZE).toEqual(10);
   });
});

describe("getAppUrl - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getAppUrl - env set - returns env value - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            NEXT_PUBLIC_APP_URL: "https://my-app.com",
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getAppUrl } = require("./constants");

         expect(getAppUrl()).toBe("https://my-app.com");
      });
   });

   it("getAppUrl - env not set - returns default fallback - test", () => {
      jest.isolateModules(() => {
         process.env = { ...originalEnv, NEXT_PUBLIC_APP_URL: undefined };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getAppUrl } = require("./constants");

         expect(() => getAppUrl()).toThrow(
            "APP_URL is not set in environment variables"
         );
      });
   });
});

describe("getIubendaApiKey - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getIubendaApiKey - key set - returns key - test", () => {
      jest.isolateModules(() => {
         process.env = { ...originalEnv, IUBENDA_API_KEY: "test-api-key" };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getIubendaApiKey } = require("./constants");

         expect(getIubendaApiKey()).toBe("test-api-key");
      });
   });

   it("getIubendaApiKey - key not set - throws error - test", () => {
      jest.isolateModules(() => {
         process.env = { ...originalEnv, IUBENDA_API_KEY: undefined };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getIubendaApiKey } = require("./constants");

         expect(() => getIubendaApiKey()).toThrow(
            "IUBENDA_API_KEY is not set in environment variables"
         );
      });
   });
});

describe("getIubendaConsentUrl - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getIubendaConsentUrl - url set - returns url - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            IUBENDA_CONSENT_URL: "https://consent.iubenda.com",
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getIubendaConsentUrl } = require("./constants");

         expect(getIubendaConsentUrl()).toBe("https://consent.iubenda.com");
      });
   });

   it("getIubendaConsentUrl - url not set - throws error - test", () => {
      jest.isolateModules(() => {
         process.env = { ...originalEnv, IUBENDA_CONSENT_URL: undefined };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getIubendaConsentUrl } = require("./constants");

         expect(() => getIubendaConsentUrl()).toThrow(
            "IUBENDA_CONSENT_URL is not set in environment variables"
         );
      });
   });
});

describe("getBrevoApiKey - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getBrevoApiKey - key set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            BREVO_API_KEY: "brevo-key-123",
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getBrevoApiKey } = require("./constants");

         expect(getBrevoApiKey()).toBe("brevo-key-123");
      });
   });

   it("getBrevoApiKey - key not set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            BREVO_API_KEY: undefined,
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getBrevoApiKey } = require("./constants");

         expect(() => getBrevoApiKey()).toThrow(
            "BREVO_API_KEY is not set in environment variables"
         );
      });
   });
});

describe("getBrevoSenderEmail - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getBrevoSenderEmail - email set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            BREVO_SENDER_EMAIL: "noreply@example.com",
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getBrevoSenderEmail } = require("./constants");

         expect(getBrevoSenderEmail()).toBe("noreply@example.com");
      });
   });

   it("getBrevoSenderEmail - email not set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            BREVO_SENDER_EMAIL: undefined,
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getBrevoSenderEmail } = require("./constants");

         expect(() => getBrevoSenderEmail()).toThrow(
            "BREVO_SENDER_EMAIL is not set in environment variables"
         );
      });
   });
});

describe("getSmtpHost - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getSmtpHost - host set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            SMTP_HOST: "localhost",
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getSmtpHost } = require("./constants");

         expect(getSmtpHost()).toBe("localhost");
      });
   });

   it("getSmtpHost - host not set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            SMTP_HOST: undefined,
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getSmtpHost } = require("./constants");

         expect(() => getSmtpHost()).toThrow(
            "SMTP_HOST is not set in environment variables"
         );
      });
   });
});

describe("getSmtpPort - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getSmtpPort - port set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            SMTP_PORT: "1025",
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getSmtpPort } = require("./constants");

         expect(getSmtpPort()).toBe(1025);
      });
   });

   it("getSmtpPort - port not - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            SMTP_PORT: undefined,
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getSmtpPort } = require("./constants");

         expect(() => getSmtpPort()).toThrow(
            "SMTP_PORT is not set in environment variables"
         );
      });
   });
});

describe("getSmtpFrom - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("getSmtpFrom - from set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            SMTP_FROM: "noreply@localhost",
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getSmtpFrom } = require("./constants");

         expect(getSmtpFrom()).toBe("noreply@localhost");
      });
   });

   it("getSmtpFrom - from not set - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            SMTP_FROM: undefined,
         };
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         const { getSmtpFrom } = require("./constants");

         expect(() => getSmtpFrom()).toThrow(
            "SMTP_FROM is not set in environment variables"
         );
      });
   });
});
