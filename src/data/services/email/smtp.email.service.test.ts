jest.mock("nodemailer");
jest.mock("@/lib/constants", () => ({
   ...jest.requireActual("@/lib/constants"),
   getSmtpHost: jest.fn().mockReturnValue("localhost"),
   getSmtpPort: jest.fn().mockReturnValue(1025),
   getSmtpFrom: jest.fn().mockReturnValue("noreply@localhost"),
   APP_NAME: "Vision Notes",
}));

import { ctestData } from "@tests";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import {
   APP_NAME,
   getSmtpFrom,
   getSmtpHost,
   getSmtpPort,
} from "@/lib/constants";

import { SmtpEmailService } from "./smtp.email.service";
import { EmailVerificationParams, PasswordResetEmailParams } from "./types";
import {
   emailVerificationHtml,
   emailVerificationText,
   passwordResetHtml,
   passwordResetText,
} from "./utils";

const nodemailerMock = nodemailer as jest.Mocked<typeof nodemailer>;
const sendMailMock = jest.fn().mockResolvedValue({});

nodemailerMock.createTransport.mockReturnValue({
   sendMail: sendMailMock,
} as unknown as ReturnType<typeof nodemailer.createTransport>);

const service = new SmtpEmailService();

const expectedTransportOptions: SMTPTransport.Options = {
   host: getSmtpHost(),
   port: getSmtpPort(),
   secure: false,
   auth: undefined,
};

describe("sendVerificationEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("smtp error - test", async () => {
      const error = new Error("SMTP connection refused");
      sendMailMock.mockRejectedValue(error);

      const params: EmailVerificationParams = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      const fn = async () => await service.sendVerificationEmail(params);
      await expect(fn).rejects.toThrow("SMTP connection refused");
   });

   it("email sent - test", async () => {
      const info = ctestData.nodemailderSentMessageInfo();
      sendMailMock.mockResolvedValue(info);

      const params: EmailVerificationParams = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendVerificationEmail(params);

      const expectedMailOptions: Mail.Options = {
         from: `"${APP_NAME}" <${getSmtpFrom()}>`,
         to: params.to,
         subject: `${APP_NAME} – E-Mail-Adresse bestätigen`,
         html: emailVerificationHtml(
            APP_NAME,
            params.name,
            params.verificationUrl
         ),
         text: emailVerificationText(
            APP_NAME,
            params.name,
            params.verificationUrl
         ),
      };

      expect(nodemailerMock.createTransport).toHaveBeenCalledTimes(1);
      expect(nodemailerMock.createTransport).toHaveBeenCalledWith(
         expectedTransportOptions
      );
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith(expectedMailOptions);
   });
});

describe("sendPasswordResetEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("smtp error - test", async () => {
      const error = new Error("SMTP connection refused");
      sendMailMock.mockRejectedValue(error);

      const params: PasswordResetEmailParams = {
         to: "user@example.com",
         name: "Test User",
         resetUrl: "https://example.com/verify?token=abc123",
      };

      const fn = async () => await service.sendPasswordResetEmail(params);
      await expect(fn).rejects.toThrow("SMTP connection refused");
   });

   it("email sent - test", async () => {
      const info = ctestData.nodemailderSentMessageInfo();
      sendMailMock.mockResolvedValue(info);

      const params: PasswordResetEmailParams = {
         to: "user@example.com",
         name: "Test User",
         resetUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendPasswordResetEmail(params);

      const expectedMailOptions: Mail.Options = {
         from: `"${APP_NAME}" <${getSmtpFrom()}>`,
         to: params.to,
         subject: `${APP_NAME} – Passwort zurücksetzen`,
         html: passwordResetHtml(APP_NAME, params.name, params.resetUrl),
         text: passwordResetText(APP_NAME, params.name, params.resetUrl),
      };

      expect(nodemailerMock.createTransport).toHaveBeenCalledTimes(1);
      expect(nodemailerMock.createTransport).toHaveBeenCalledWith(
         expectedTransportOptions
      );
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith(expectedMailOptions);
   });
});
