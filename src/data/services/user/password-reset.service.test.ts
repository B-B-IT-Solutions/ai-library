jest.mock("@/data/repositories/user");
jest.mock("@/data/services/email");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import { PasswordResetRepository } from "@/data/repositories/user";
import {
   BrevoEmailService,
   PasswordResetEmailParams,
} from "@/data/services/email";
import { ServiceFactory } from "@/data/services/service.factory";
import { APP_URL } from "@/lib/constants";

import { PasswordResetService } from "./password-reset.service";

const serviceFactory = new ServiceFactory(prisma);
const emailService = serviceFactory.getEmailService();
const emailServiceMock = emailService as DeepMockProxy<BrevoEmailService>;

const passwordResetRepo = new PasswordResetRepository(prisma);
const passwordResetRepoMock =
   passwordResetRepo as DeepMockProxy<PasswordResetRepository>;

const service = new PasswordResetService(
   passwordResetRepoMock,
   emailServiceMock
);

describe("sendPasswordResetEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("creates token and sends password reset email", async () => {
      const email = "test@email.com";
      const name = "Test User";
      const token = "generated-uuid-token";

      passwordResetRepoMock.pCreateToken.mockResolvedValue(token);
      emailServiceMock.sendPasswordResetEmail.mockResolvedValue(undefined);

      await service.sendPasswordResetEmail(email, name);

      const expectedResetUrl = `${APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
      const expectedParams: PasswordResetEmailParams = {
         to: email,
         name,
         resetUrl: expectedResetUrl,
      };

      expect(passwordResetRepoMock.pCreateToken).toHaveBeenCalledTimes(1);
      expect(passwordResetRepoMock.pCreateToken).toHaveBeenCalledWith(email);
      expect(emailServiceMock.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.sendPasswordResetEmail).toHaveBeenCalledWith(
         expectedParams
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

   it("token not found", async () => {
      const email = "test@email.com";
      const token = "token-123";

      passwordResetRepoMock.pGetToken.mockResolvedValue(null);

      const result = await service.verifyToken(email, token);

      expect(result).toBe(false);
      expect(passwordResetRepoMock.pGetToken).toHaveBeenCalledWith(
         email,
         token
      );
      expect(passwordResetRepoMock.pDeleteToken).not.toHaveBeenCalled();
   });

   it("token expired", async () => {
      const dToken = dtestData.dResetPasswordToken();
      dToken.expires = new Date("2025-09-27");
      passwordResetRepoMock.pGetToken.mockResolvedValue(dToken);

      const result = await service.verifyToken(dToken.identifier, dToken.token);

      expect(result).toBe(false);
      expect(passwordResetRepoMock.pDeleteToken).toHaveBeenCalledTimes(1);
      expect(passwordResetRepoMock.pDeleteToken).toHaveBeenCalledWith(
         dToken.identifier,
         dToken.token
      );
   });

   it("token valid", async () => {
      const dToken = dtestData.dResetPasswordToken();
      dToken.expires = new Date("2035-09-27");
      passwordResetRepoMock.pGetToken.mockResolvedValue(dToken);

      const result = await service.verifyToken(dToken.identifier, dToken.token);

      expect(result).toBe(true);
      expect(passwordResetRepoMock.pDeleteToken).not.toHaveBeenCalled();
   });
});

describe("consumeToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27T12:00:00.000Z");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("token invalid", async () => {
      passwordResetRepoMock.pGetToken.mockResolvedValue(null);

      const result = await service.consumeToken("test@email.com", "bad-token");

      expect(result).toBe(false);
      expect(passwordResetRepoMock.pDeleteToken).not.toHaveBeenCalled();
   });

   it("token valid", async () => {
      const dToken = dtestData.dVerificationToken();
      dToken.expires = new Date("2035-09-27");
      passwordResetRepoMock.pGetToken.mockResolvedValue(dToken);
      passwordResetRepoMock.pDeleteToken.mockResolvedValue(undefined);

      const result = await service.consumeToken(
         dToken.identifier,
         dToken.token
      );

      expect(result).toBe(true);
      expect(passwordResetRepoMock.pDeleteToken).toHaveBeenCalledTimes(1);
      expect(passwordResetRepoMock.pDeleteToken).toHaveBeenCalledWith(
         dToken.identifier,
         dToken.token
      );
   });
});
