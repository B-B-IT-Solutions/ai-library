import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import {
   VerificationTokenCreateArgs,
   VerificationTokenDeleteArgs,
   VerificationTokenDeleteManyArgs,
   VerificationTokenFindUniqueArgs,
} from "@/generated/prisma/models";

import { VerificationTokenRepository } from "./verification-token.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repository = new VerificationTokenRepository(prismaMock);

const FIXED_NOW = "2025-09-27T12:00:00.000Z";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const FIXED_UUID = "test-uuid-1234-5678";

describe("pCreateToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set(FIXED_NOW);
      jest
         .spyOn(crypto, "randomUUID")
         .mockReturnValue(
            FIXED_UUID as `${string}-${string}-${string}-${string}-${string}`
         );
   });

   afterEach(() => {
      MockDate.reset();
      jest.restoreAllMocks();
   });

   it("token created - test", async () => {
      const token = ptestData.pVerificationToken();
      const expectedExpires = new Date(
         new Date(FIXED_NOW).getTime() + TOKEN_EXPIRY_MS
      );

      prismaMock.verificationToken.deleteMany.mockResolvedValue();
      prismaMock.verificationToken.create.mockResolvedValue(token);

      const result = await repository.pCreateToken(token.identifier);

      const expectedDeleteArgs: VerificationTokenDeleteManyArgs = {
         where: {
            identifier: token.identifier,
         },
      };

      const expectedCreateArgs: VerificationTokenCreateArgs = {
         data: {
            identifier: token.identifier,
            token: FIXED_UUID,
            expires: expectedExpires,
         },
      };

      expect(result).toBe(FIXED_UUID);
      expect(prismaMock.verificationToken.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.verificationToken.deleteMany).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
      expect(prismaMock.verificationToken.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.verificationToken.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});

describe("pGetToken tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetToken - token not found - returns null - test", async () => {
      const email = "user@test.com";
      const token = "token-123";
      prismaMock.verificationToken.findUnique.mockResolvedValue(null);

      const result = await repository.pGetToken(email, token);

      const expectedArgs: VerificationTokenFindUniqueArgs = {
         where: { identifier_token: { identifier: email, token } },
      };

      expect(result).toBeNull();
      expect(prismaMock.verificationToken.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.verificationToken.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("pGetToken - token found - returns token - test", async () => {
      const pToken = ptestData.pVerificationToken();
      prismaMock.verificationToken.findUnique.mockResolvedValue(pToken);

      const result = await repository.pGetToken(
         pToken.identifier,
         pToken.token
      );

      const expectedArgs: VerificationTokenFindUniqueArgs = {
         where: {
            identifier_token: {
               identifier: pToken.identifier,
               token: pToken.token,
            },
         },
      };

      expect(result).toEqual(pToken);
      expect(prismaMock.verificationToken.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.verificationToken.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pDeleteToken tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pDeleteToken - deletes token with correct args - test", async () => {
      const email = "user@test.com";
      const token = "token-123";
      prismaMock.verificationToken.delete.mockResolvedValue(
         ptestData.pVerificationToken()
      );

      await repository.pDeleteToken(email, token);

      const expectedDeleteArgs: VerificationTokenDeleteArgs = {
         where: { identifier_token: { identifier: email, token } },
      };

      expect(prismaMock.verificationToken.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.verificationToken.delete).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
   });
});
