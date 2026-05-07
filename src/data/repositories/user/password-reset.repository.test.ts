import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import {
   PasswordResetTokenCreateArgs,
   PasswordResetTokenDeleteArgs,
   PasswordResetTokenDeleteManyArgs,
   PasswordResetTokenFindUniqueArgs,
} from "@/generated/prisma/models";

import { PasswordResetRepository } from "./password-reset.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repository = new PasswordResetRepository(prismaMock);

const FIXED_NOW = "2025-09-27T12:00:00.000Z";
const TOKEN_EXPIRY_MS = 1 * 60 * 60 * 1000;
const FIXED_UUID = "test-uuid-1234-5678";

describe("pGetToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("token null - test", async () => {
      const email = "user@test.com";
      const token = "token-123";
      prismaMock.passwordResetToken.findUnique.mockResolvedValue(null);

      const result = await repository.pGetToken(email, token);

      const expectedArgs: PasswordResetTokenFindUniqueArgs = {
         where: {
            identifier_token: { identifier: email, token },
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.passwordResetToken.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.passwordResetToken.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("token retrieved - test", async () => {
      const token = ptestData.pPasswordResetToken();
      prismaMock.passwordResetToken.findUnique.mockResolvedValue(token);

      const result = await repository.pGetToken(token.identifier, token.token);

      const expectedArgs: PasswordResetTokenFindUniqueArgs = {
         where: {
            identifier_token: {
               identifier: token.identifier,
               token: token.token,
            },
         },
      };

      expect(result).toEqual(token);
      expect(prismaMock.passwordResetToken.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.passwordResetToken.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pCreateToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set(FIXED_NOW);
      jest.spyOn(crypto, "randomUUID").mockReturnValue(FIXED_UUID);
   });

   afterEach(() => {
      MockDate.reset();
      jest.restoreAllMocks();
   });

   it("token created - test", async () => {
      const token = ptestData.pPasswordResetToken();
      const expectedExpires = new Date(
         new Date(FIXED_NOW).getTime() + TOKEN_EXPIRY_MS
      );

      prismaMock.passwordResetToken.deleteMany.mockResolvedValue();
      prismaMock.passwordResetToken.create.mockResolvedValue(token);

      const result = await repository.pCreateToken(token.identifier);

      const expectedDeleteArgs: PasswordResetTokenDeleteManyArgs = {
         where: {
            identifier: token.identifier,
         },
      };

      const expectedCreateArgs: PasswordResetTokenCreateArgs = {
         data: {
            identifier: token.identifier,
            token: FIXED_UUID,
            expires: expectedExpires,
         },
      };

      expect(result).toBe(FIXED_UUID);
      expect(prismaMock.passwordResetToken.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.passwordResetToken.deleteMany).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
      expect(prismaMock.passwordResetToken.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.passwordResetToken.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});

describe("pDeleteToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("token deleted - test", async () => {
      const token = ptestData.pPasswordResetToken();
      prismaMock.passwordResetToken.delete.mockResolvedValue(token);

      await repository.pDeleteToken(token.identifier, token.token);

      const expectedDeleteArgs: PasswordResetTokenDeleteArgs = {
         where: {
            identifier_token: {
               identifier: token.identifier,
               token: token.token,
            },
         },
      };

      expect(prismaMock.passwordResetToken.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.passwordResetToken.delete).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
   });
});
