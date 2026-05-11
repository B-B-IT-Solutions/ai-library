jest.mock("@/data/repositories/user");
jest.mock("@/data/services/email");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import { VerificationTokenRepository } from "@/data/repositories/user";
import {
   BrevoEmailService,
   EmailVerificationParams,
} from "@/data/services/email";
import { ServiceFactory } from "@/data/services/service.factory";
import { getAppUrl } from "@/lib/constants";

import { VerificationTokenService } from "./email-verification.service";

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

   it("creates token and sends email - test", async () => {
      const email = "test@email.com";
      const name = "Test User";
      const token = "generated-uuid-token";

      tokenRepoMock.pCreateToken.mockResolvedValue(token);
      emailServiceMock.sendVerificationEmail.mockResolvedValue(undefined);

      await service.sendVerificationEmail(email, name);

      const expectedVerificationurl = `${getAppUrl()}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
      const expectedParams: EmailVerificationParams = {
         to: email,
         name,
         verificationUrl: expectedVerificationurl,
      };

      expect(tokenRepoMock.pCreateToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pCreateToken).toHaveBeenCalledWith(email);
      expect(emailServiceMock.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.sendVerificationEmail).toHaveBeenCalledWith(
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

   it("token not found - test", async () => {
      const email = "test@email.com";
      const token = "token-123";

      tokenRepoMock.pGetToken.mockResolvedValue(null);

      const result = await service.verifyToken(email, token);

      expect(result).toBe(false);
      expect(tokenRepoMock.pGetToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pGetToken).toHaveBeenCalledWith(email, token);
      expect(tokenRepoMock.pDeleteToken).not.toHaveBeenCalled();
   });

   it("token expired - test", async () => {
      const dToken = dtestData.dVerificationToken();
      dToken.expires = new Date("2025-09-27");
      tokenRepoMock.pGetToken.mockResolvedValue(dToken);

      const result = await service.verifyToken(dToken.identifier, dToken.token);

      expect(result).toBe(false);
      expect(tokenRepoMock.pGetToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pGetToken).toHaveBeenCalledWith(
         dToken.identifier,
         dToken.token
      );
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledWith(
         dToken.identifier,
         dToken.token
      );
   });

   it("token valid - test", async () => {
      const dToken = dtestData.dVerificationToken();
      dToken.expires = new Date("2035-09-27");
      tokenRepoMock.pGetToken.mockResolvedValue(dToken);

      const result = await service.verifyToken(dToken.identifier, dToken.token);

      expect(result).toBe(true);
      expect(tokenRepoMock.pGetToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pGetToken).toHaveBeenCalledWith(
         dToken.identifier,
         dToken.token
      );
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledTimes(1);
      expect(tokenRepoMock.pDeleteToken).toHaveBeenCalledWith(
         dToken.identifier,
         dToken.token
      );
   });
});
