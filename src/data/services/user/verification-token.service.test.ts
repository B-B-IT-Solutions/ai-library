jest.mock("@/data/repositories/verification-token");
jest.mock("@/data/services/email");

import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import { VerificationTokenRepository } from "@/data/repositories/verification-token";
import { BrevoEmailService } from "@/data/services/email";
import { ServiceFactory } from "@/data/services/service.factory";

import { VerificationTokenService } from "./verification-token.service";

const serviceFactory = new ServiceFactory(prisma);
const emailService = serviceFactory.getEmailService();
const emailServiceMock = emailService as DeepMockProxy<BrevoEmailService>;

const tokenRepo = new VerificationTokenRepository(prisma);
const tokenRepoMock = tokenRepo as DeepMockProxy<VerificationTokenRepository>;

const service = new VerificationTokenService(tokenRepoMock, emailServiceMock);

describe("sendVerificationEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("sendVerificationEmail - creates token and sends email - test", async () => {
      const email = "test@email.com";
      const name = "Test User";
      const token = "generated-uuid-token";

      tokenRepoMock.pCreateToken.mockResolvedValue(token);
      emailServiceMock.sendVerificationEmail.mockResolvedValue(undefined);

      await service.sendVerificationEmail(email, name);

      expect(tokenRepoMock.pCreateToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pCreateToken).toHaveBeenCalledWith(email);
      expect(emailServiceMock.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.sendVerificationEmail).toHaveBeenCalledWith(
         expect.objectContaining({
            to: email,
            name,
            verificationUrl: expect.stringContaining(token),
         })
      );
   });
});

describe("verifyToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27T12:00:00.000Z");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("verifyToken - token not found - returns false - test", async () => {
      tokenRepoMock.pFindToken.mockResolvedValue(null);

      const result = await service.verifyToken("test@email.com", "token-123");

      expect(result).toBe(false);
      expect(tokenRepoMock.pDeleteToken).not.toHaveBeenCalled();
   });

   it("verifyToken - token expired - deletes and returns false - test", async () => {
      tokenRepoMock.pFindToken.mockResolvedValue({
         identifier: "test@email.com",
         token: "token-123",
         expires: new Date("2025-09-27T11:00:00.000Z"),
      });

      const result = await service.verifyToken("test@email.com", "token-123");

      expect(result).toBe(false);
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledWith(
         "test@email.com",
         "token-123"
      );
   });

   it("verifyToken - valid token - deletes and returns true - test", async () => {
      tokenRepoMock.pFindToken.mockResolvedValue({
         identifier: "test@email.com",
         token: "token-123",
         expires: new Date("2025-09-27T13:00:00.000Z"),
      });

      const result = await service.verifyToken("test@email.com", "token-123");

      expect(result).toBe(true);
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledWith(
         "test@email.com",
         "token-123"
      );
   });
});
