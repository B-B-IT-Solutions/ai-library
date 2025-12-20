import {
   APP_DESCRIPTION,
   APP_NAME,
   APP_URL,
   INIT_PAGE_NUMBER,
   PAGE_SIZE,
   STRIPE_SECRET_KEY,
   STRIPE_WEBHOOK_SECRET,
} from "./constants";

describe("Constants tests", () => {
   it("Constants test", async () => {
      expect(APP_NAME).toEqual("KI Bibliothek");
      expect(APP_DESCRIPTION).toEqual("Modernene KI-Bibliothek");
      expect(APP_URL).toEqual("http://localhost:3000");
      expect(STRIPE_WEBHOOK_SECRET).toEqual(
         "0o3d0b4S9CeARjPD9QnK3xgq96a7esuI4nxtLZEWNSk="
      );
      expect(STRIPE_SECRET_KEY).toEqual(
         "sk_test_0o3d0b4S9CeARjPD9QnK3xgq96a7esuI4nxtLZEWNSk"
      );
      expect(INIT_PAGE_NUMBER).toEqual(0);
      expect(PAGE_SIZE).toEqual(10);
   });
});

describe("Constants validation tests", () => {
   const originalEnv = process.env;

   const originalConsoleLog = console.log;
   const originalConsoleError = console.error;

   beforeEach(() => {
      console.log = jest.fn();
      console.error = jest.fn();
   });

   afterEach(() => {
      process.env = originalEnv;
      jest.resetModules();
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
   });

   it("should throw error when STRIPE_WEBHOOK_SECRET is not set", async () => {
      const env = { ...originalEnv };
      delete env.STRIPE_WEBHOOK_SECRET;
      process.env = env;

      jest.resetModules();

      await expect(
         jest.isolateModulesAsync(async () => {
            await import("./constants");
         })
      ).rejects.toThrow(
         "STRIPE_WEBHOOK_SECRET is not set in environment variables"
      );
   });

   it("should throw error when STRIPE_SECRET_KEY is not set", async () => {
      const env = { ...originalEnv };
      delete env.STRIPE_SECRET_KEY;
      process.env = env;

      jest.resetModules();

      await expect(
         jest.isolateModulesAsync(async () => {
            await import("./constants");
         })
      ).rejects.toThrow(
         "STRIPE_SECRET_KEY is not set in environment variables"
      );
   });
});
