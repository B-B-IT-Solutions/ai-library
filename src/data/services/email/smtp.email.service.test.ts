jest.mock("nodemailer");
jest.mock("@/lib/constants", () => ({
   ...jest.requireActual("@/lib/constants"),
   getSmtpHost: jest.fn().mockReturnValue("localhost"),
   getSmtpPort: jest.fn().mockReturnValue(1025),
   getSmtpFrom: jest.fn().mockReturnValue("noreply@localhost"),
   APP_NAME: "Vision Notes",
}));

import nodemailer from "nodemailer";

import { SmtpEmailService } from "./smtp.email.service";

const nodemailerMock = nodemailer as jest.Mocked<typeof nodemailer>;
const sendMailMock = jest.fn().mockResolvedValue({});

nodemailerMock.createTransport.mockReturnValue({
   sendMail: sendMailMock,
} as unknown as ReturnType<typeof nodemailer.createTransport>);

describe("SmtpEmailService tests", () => {
   let service: SmtpEmailService;

   beforeEach(() => {
      jest.clearAllMocks();
      nodemailerMock.createTransport.mockReturnValue({
         sendMail: sendMailMock,
      } as unknown as ReturnType<typeof nodemailer.createTransport>);
      service = new SmtpEmailService();
   });

   it("sendVerificationEmail - creates transporter with correct config - test", async () => {
      const params = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendVerificationEmail(params);

      expect(nodemailerMock.createTransport).toHaveBeenCalledTimes(1);
      expect(nodemailerMock.createTransport).toHaveBeenCalledWith(
         expect.objectContaining({
            host: "localhost",
            port: 1025,
            secure: false,
         })
      );
   });

   it("sendVerificationEmail - sends email with correct params - test", async () => {
      const params = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendVerificationEmail(params);

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith(
         expect.objectContaining({
            to: params.to,
            subject: expect.stringContaining("E-Mail-Adresse bestätigen"),
            html: expect.stringContaining(params.verificationUrl),
            text: expect.stringContaining(params.verificationUrl),
         })
      );
   });

   it("sendVerificationEmail - throws error on failure - test", async () => {
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
