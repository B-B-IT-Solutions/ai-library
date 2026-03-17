import {
   APP_DESCRIPTION,
   APP_NAME,
   APP_URL,
   getIubendaApiKey,
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

describe("createPrismaClient - USE_AZURE_IDENTITY false - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
      jest.resetModules();
   });

   it("sets globalForPrisma.prisma in non-production environment", () => {
      jest.resetModules();

      require("./constants");

      expect(getIubendaApiKey()).not.toBeUndefined();
   });

   it("does not set globalForPrisma.prisma in production environment", () => {
      process.env = { ...originalEnv, NODE_ENV: "production" };
      jest.resetModules();

      require("./prisma");

      expect(globalForPrisma.prisma).toBeUndefined();
   });
});
