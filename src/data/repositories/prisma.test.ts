jest.mock("./prisma", () => ({
   ...jest.requireActual("./prisma"),
}));

jest.mock("@azure/identity");

import { ManagedIdentityCredential } from "@azure/identity";
import { PrismaClient } from "@prisma/client";
import { assertStringifyEqual } from "@tests";

import prisma, { extendsConfig } from "./prisma";

const ManagedIdentityCredentialMock =
   ManagedIdentityCredential as jest.MockedClass<
      typeof ManagedIdentityCredential
   >;

export const expectedExtendsConfig = {};

describe("prisma tests", () => {
   it("prisma test", async () => {
      expect(prisma).not.toBeNull();
      expect(global.prisma).not.toBeNull();
   });
});

describe("config tests", () => {
   it("extendsConfig test", async () => {
      expect(prisma).not.toBeNull();
      assertStringifyEqual(extendsConfig, expectedExtendsConfig);
   });
});

// describe("createPrismaClient - USE_AZURE_IDENTITY false - tests", () => {
//    const originalEnv = process.env;

//    beforeEach(() => {
//       // jest.resetModules();
//    });

//    afterEach(() => {
//       process.env = originalEnv;
//    });

//    it("sets globalForPrisma.prisma in non-production environment", () => {
//       let prisma: PrismaClient;
//       let prismaGlobal: PrismaClient;

//       jest.isolateModules(() => {
//          prisma = import("./prisma");
//          prismaGlobal = global.prisma;
//       });

//       expect(prisma).not.toBeUndefined();
//       expect(prismaGlobal).not.toBeUndefined();
//    });

//    it("reuses existing globalForPrisma.prisma when already set", async () => {
//       const mockExistingPrisma = { existing: true };

//       let prisma: PrismaClient;

//       await jest.isolateModulesAsync(async () => {
//          delete global.prisma;
//          global.prisma = mockExistingPrisma;

//          prisma = await import("./prisma");
//       });

//       // expect(prisma.default.default).toBe(mockExistingPrisma);
//    });

//    it("does not set globalForPrisma.prisma in production environment", () => {
//       process.env = { ...originalEnv, NODE_ENV: "production" };
//       delete global.prisma;

//       jest.isolateModules(() => import("./prisma"));

//       expect(global.prisma).toBeUndefined();
//    });
// });

describe("createPrismaClient - USE_AZURE_IDENTITY true - tests", () => {
   const originalEnv = process.env;

   beforeEach(() => {
      jest.resetModules();
      delete global.prisma;

      process.env = {
         ...originalEnv,
         USE_AZURE_IDENTITY: "true",
         DATABASE_URL: "postgresql://testuser@testhost:5432/testdb",
         AZURE_CLIENT_ID: "test-client-id",
      };
   });

   afterEach(() => {
      process.env = originalEnv;
   });

   it("test", async () => {
      const mockGetToken = jest.fn().mockResolvedValue({ token: "mock-token" });
      ManagedIdentityCredentialMock.mockImplementation(() => ({
         getToken: mockGetToken,
         msiRetryConfig: {},
      }));

      const MockPool = jest.fn().mockImplementation(() => ({}));
      const MockPrismaPg = jest.fn().mockImplementation(() => ({}));
      const MockPrismaClient = jest.fn().mockImplementation(() => ({
         $extends: jest.fn().mockReturnThis(),
      }));

      jest.isolateModules(async () => {
         await import("./prisma");
      });

      expect(ManagedIdentityCredentialMock).toHaveBeenCalledTimes(1);
      expect(ManagedIdentityCredentialMock).toHaveBeenCalledWith({
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

   // it("uses default port 5432 when DATABASE_URL has no port", () => {
   //    process.env.DATABASE_URL = "postgresql://testuser@testhost/testdb";

   //    jest.isolateModules(() => import("./prisma"));

   //    const MockPool = jest.fn().mockImplementation(() => ({}));
   //    const MockPrismaClient = jest.fn().mockImplementation(() => ({
   //       $extends: jest.fn().mockReturnThis(),
   //    }));

   //    jest.isolateModules(() => {
   //       jest.doMock("@azure/identity", () => ({
   //          ManagedIdentityCredential: jest.fn().mockImplementation(() => ({
   //             getToken: jest.fn(),
   //          })),
   //       }));
   //       jest.doMock("pg", () => ({ Pool: MockPool }));
   //       jest.doMock("@prisma/adapter-pg", () => ({
   //          PrismaPg: jest.fn().mockImplementation(() => ({})),
   //       }));
   //       jest.doMock("@/generated/prisma/client", () => ({
   //          PrismaClient: MockPrismaClient,
   //       }));

   //       require("./prisma");
   //    });

   //    expect(MockPool).toHaveBeenCalledWith(
   //       expect.objectContaining({ port: 5432 })
   //    );
   // });

   // it("pool password function calls getToken with Azure scope and returns token", async () => {
   //    const mockToken = "azure-access-token";
   //    const mockGetToken = jest.fn().mockResolvedValue({ token: mockToken });
   //    const MockManagedIdentityCredential = jest
   //       .fn()
   //       .mockImplementation(() => ({
   //          getToken: mockGetToken,
   //       }));
   //    let capturedPoolConfig: any;
   //    const MockPool = jest.fn().mockImplementation((config: any) => {
   //       capturedPoolConfig = config;
   //       return {};
   //    });
   //    const MockPrismaClient = jest.fn().mockImplementation(() => ({
   //       $extends: jest.fn().mockReturnThis(),
   //    }));

   //    jest.isolateModules(() => {
   //       jest.doMock("@azure/identity", () => ({
   //          ManagedIdentityCredential: MockManagedIdentityCredential,
   //       }));
   //       jest.doMock("pg", () => ({ Pool: MockPool }));
   //       jest.doMock("@prisma/adapter-pg", () => ({
   //          PrismaPg: jest.fn().mockImplementation(() => ({})),
   //       }));
   //       jest.doMock("@/generated/prisma/client", () => ({
   //          PrismaClient: MockPrismaClient,
   //       }));

   //       require("./prisma");
   //    });

   //    expect(capturedPoolConfig).toBeDefined();
   //    const password = await capturedPoolConfig.password();
   //    expect(password).toBe(mockToken);
   //    expect(mockGetToken).toHaveBeenCalledWith(
   //       "https://ossrdbms-aad.database.windows.net/.default"
   //    );
   // });
});
