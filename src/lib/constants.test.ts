import {
   APP_DESCRIPTION,
   APP_NAME,
   APP_URL,
   INIT_PAGE_NUMBER,
   PAGE_SIZE,
   STRIPE_SECRET_KEY,
   STRIPE_WEBHOOK_SECRET,
} from "./constants";

describe("constants - static values - tests", () => {
   it("constants - APP_NAME resolves from env - test", () => {
      expect(APP_NAME).toEqual("KI Bibliothek");
   });

   it("constants - APP_DESCRIPTION resolves from env - test", () => {
      expect(APP_DESCRIPTION).toEqual("Modernene KI-Bibliothek");
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

describe("APP_URL - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
   });

   it("APP_URL - env set - returns env value - test", () => {
      jest.isolateModules(() => {
         process.env = {
            ...originalEnv,
            NEXT_PUBLIC_APP_URL: "https://my-app.com",
         };
         const { APP_URL } = require("./constants");

         expect(APP_URL).toBe("https://my-app.com");
      });
   });

   it("APP_URL - env not set - returns default fallback - test", () => {
      jest.isolateModules(() => {
         process.env = { ...originalEnv, NEXT_PUBLIC_APP_URL: undefined };
         const { APP_URL } = require("./constants");

         expect(APP_URL).toBe("http://localhost:3000");
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
         const { getIubendaApiKey } = require("./constants");

         expect(getIubendaApiKey()).toBe("test-api-key");
      });
   });

   it("getIubendaApiKey - key not set - throws error - test", () => {
      jest.isolateModules(() => {
         process.env = { ...originalEnv, IUBENDA_API_KEY: undefined };
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
         const { getIubendaConsentUrl } = require("./constants");

         expect(getIubendaConsentUrl()).toBe("https://consent.iubenda.com");
      });
   });

   it("getIubendaConsentUrl - url not set - throws error - test", () => {
      jest.isolateModules(() => {
         process.env = { ...originalEnv, IUBENDA_CONSENT_URL: undefined };
         const { getIubendaConsentUrl } = require("./constants");

         expect(() => getIubendaConsentUrl()).toThrow(
            "IUBENDA_CONSENT_URL is not set in environment variables"
         );
      });
   });
});
