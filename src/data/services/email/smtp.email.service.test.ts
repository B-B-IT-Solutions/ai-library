jest.mock("nodemailer");
jest.mock("@/lib/constants", () => ({
   ...jest.requireActual("@/lib/constants"),
   getSmtpHost: jest.fn().mockReturnValue("localhost"),
   getSmtpPort: jest.fn().mockReturnValue(1025),
   getSmtpFrom: jest.fn().mockReturnValue("noreply@localhost"),
   APP_NAME: "Vision Notes",
}));

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
import { EmailVerificationParams } from "./types";
import { buildHtml, buildText } from "./utils";

const nodemailerMock = nodemailer as jest.Mocked<typeof nodemailer>;
const sendMailMock = jest.fn().mockResolvedValue({});

nodemailerMock.createTransport.mockReturnValue({
   sendMail: sendMailMock,
} as unknown as ReturnType<typeof nodemailer.createTransport>);

const service = new SmtpEmailService();

describe("SmtpEmailService tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("sends email with correct params - test", async () => {
      const params: EmailVerificationParams = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendVerificationEmail(params);

      const expectedTransportOptions: SMTPTransport.Options = {
         host: getSmtpHost(),
         port: getSmtpPort(),
         secure: false,
         auth: undefined,
      };

      const expectedMailOptions: Mail.Options = {
         from: `"${APP_NAME}" <${getSmtpFrom()}>`,
         to: params.to,
         subject: `${APP_NAME} – E-Mail-Adresse bestätigen`,
         html: buildHtml(APP_NAME, params.name, params.verificationUrl),
         text: buildText(APP_NAME, params.name, params.verificationUrl),
      };

      expect(nodemailerMock.createTransport).toHaveBeenCalledTimes(1);
      expect(nodemailerMock.createTransport).toHaveBeenCalledWith(
         expectedTransportOptions
      );
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith(expectedMailOptions);
   });

   it("throws error on failure - test", async () => {
      sendMailMock.mockRejectedValue(new Error("SMTP connection refused"));
      const params = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await expect(service.sendVerificationEmail(params)).rejects.toThrow(
         "SMTP connection refused"
      );
   });
});
