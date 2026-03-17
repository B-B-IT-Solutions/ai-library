jest.mock("./prisma", () => ({
   ...jest.requireActual("./prisma"),
}));

import { assertStringifyEqual } from "@tests";

import { PrismaClient } from "@/generated/prisma/client";

import prisma, { AZURE_TOKEN_SCOPE, extendsConfig } from "./prisma";

const globalForPrisma = global as unknown as {
   prisma?: PrismaClient;
};

const expectedExtendsConfig = {};

const expectedAzureTokenScope =
   "https://ossrdbms-aad.database.windows.net/.default";

describe("prisma tests", () => {
   it("prisma test", async () => {
      expect(prisma).not.toBeNull();
      expect(globalForPrisma.prisma).not.toBeNull();
   });
});

describe("config tests", () => {
   it("extendsConfig test", async () => {
      expect(prisma).not.toBeNull();
      assertStringifyEqual(extendsConfig, expectedExtendsConfig);
   });

   it("AZURE_TOKEN_SCOPE test", async () => {
      expect(prisma).not.toBeNull();
      expect(AZURE_TOKEN_SCOPE).toEqual(expectedAzureTokenScope);
   });
});

describe("createPrismaClient - USE_AZURE_IDENTITY false - tests", () => {
   const originalEnv = process.env;

   afterEach(() => {
      process.env = originalEnv;
      jest.resetModules();
      delete globalForPrisma.prisma;
   });

   it("sets globalForPrisma.prisma in non-production environment", () => {
      delete globalForPrisma.prisma;
      jest.resetModules();

      require("./prisma");

      expect(globalForPrisma.prisma).not.toBeUndefined();
   });

   it("reuses existing globalForPrisma.prisma when already set", () => {
      const mockExistingPrisma = { existing: true } as unknown as PrismaClient;
      globalForPrisma.prisma = mockExistingPrisma;
      jest.resetModules();

      const result = require("./prisma").default;

      expect(result).toBe(mockExistingPrisma);
   });

   it("does not set globalForPrisma.prisma in production environment", () => {
      delete globalForPrisma.prisma;
      process.env = { ...originalEnv, NODE_ENV: "production" };
      jest.resetModules();

      require("./prisma");

      expect(globalForPrisma.prisma).toBeUndefined();
   });
});

describe("createPrismaClient - USE_AZURE_IDENTITY true - tests", () => {
   const originalEnv = process.env;

   beforeEach(() => {
      delete globalForPrisma.prisma;
      process.env = {
         ...originalEnv,
         USE_AZURE_IDENTITY: "true",
         DATABASE_URL: "postgresql://testuser@testhost:5432/testdb",
         AZURE_CLIENT_ID: "test-client-id",
      };
   });

   afterEach(() => {
      process.env = originalEnv;
      jest.resetModules();
      delete globalForPrisma.prisma;
   });

   it("creates ManagedIdentityCredential, Pool, PrismaPg and PrismaClient with adapter", () => {
      const mockGetToken = jest.fn().mockResolvedValue({ token: "mock-token" });
      const MockManagedIdentityCredential = jest
         .fn()
         .mockImplementation(() => ({
            getToken: mockGetToken,
         }));
      const MockPool = jest.fn().mockImplementation(() => ({}));
      const MockPrismaPg = jest.fn().mockImplementation(() => ({}));
      const MockPrismaClient = jest.fn().mockImplementation(() => ({
         $extends: jest.fn().mockReturnThis(),
      }));

      jest.resetModules();
      jest.doMock("@azure/identity", () => ({
         ManagedIdentityCredential: MockManagedIdentityCredential,
      }));
      jest.doMock("pg", () => ({ Pool: MockPool }));
      jest.doMock("@prisma/adapter-pg", () => ({ PrismaPg: MockPrismaPg }));
      jest.doMock("@/generated/prisma/client", () => ({
         PrismaClient: MockPrismaClient,
      }));

      require("./prisma");

      expect(MockManagedIdentityCredential).toHaveBeenCalledWith({
         clientId: "test-client-id",
      });
      expect(MockPool).toHaveBeenCalledWith(
         expect.objectContaining({
            host: "testhost",
            port: 5432,
            database: "testdb",
            user: "testuser",
            ssl: true,
         })
      );
      expect(MockPrismaPg).toHaveBeenCalledWith(expect.any(Object));
      expect(MockPrismaClient).toHaveBeenCalledWith(
         expect.objectContaining({
            log: ["warn", "error"],
            adapter: expect.any(Object),
         })
      );
   });

   it("uses default port 5432 when DATABASE_URL has no port", () => {
      process.env.DATABASE_URL = "postgresql://testuser@testhost/testdb";

      const MockPool = jest.fn().mockImplementation(() => ({}));
      const MockPrismaClient = jest.fn().mockImplementation(() => ({
         $extends: jest.fn().mockReturnThis(),
      }));

      jest.resetModules();
      jest.doMock("@azure/identity", () => ({
         ManagedIdentityCredential: jest.fn().mockImplementation(() => ({
            getToken: jest.fn(),
         })),
      }));
      jest.doMock("pg", () => ({ Pool: MockPool }));
      jest.doMock("@prisma/adapter-pg", () => ({
         PrismaPg: jest.fn().mockImplementation(() => ({})),
      }));
      jest.doMock("@/generated/prisma/client", () => ({
         PrismaClient: MockPrismaClient,
      }));

      require("./prisma");

      expect(MockPool).toHaveBeenCalledWith(
         expect.objectContaining({ port: 5432 })
      );
   });

   it("pool password function calls getToken with Azure scope and returns token", async () => {
      const mockToken = "azure-access-token";
      const mockGetToken = jest.fn().mockResolvedValue({ token: mockToken });
      const MockManagedIdentityCredential = jest
         .fn()
         .mockImplementation(() => ({
            getToken: mockGetToken,
         }));
      let capturedPoolConfig: any;
      const MockPool = jest.fn().mockImplementation((config: any) => {
         capturedPoolConfig = config;
         return {};
      });
      const MockPrismaClient = jest.fn().mockImplementation(() => ({
         $extends: jest.fn().mockReturnThis(),
      }));

      jest.resetModules();
      jest.doMock("@azure/identity", () => ({
         ManagedIdentityCredential: MockManagedIdentityCredential,
      }));
      jest.doMock("pg", () => ({ Pool: MockPool }));
      jest.doMock("@prisma/adapter-pg", () => ({
         PrismaPg: jest.fn().mockImplementation(() => ({})),
      }));
      jest.doMock("@/generated/prisma/client", () => ({
         PrismaClient: MockPrismaClient,
      }));

      require("./prisma");

      expect(capturedPoolConfig).toBeDefined();
      const password = await capturedPoolConfig.password();
      expect(password).toBe(mockToken);
      expect(mockGetToken).toHaveBeenCalledWith(expectedAzureTokenScope);
   });
});
