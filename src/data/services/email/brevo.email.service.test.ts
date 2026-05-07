jest.mock("@getbrevo/brevo");

import { Brevo, BrevoClient } from "@getbrevo/brevo";
import { ctestData } from "@tests";

import { APP_NAME, getBrevoSenderEmail } from "@/lib/constants";

import { BrevoEmailService } from "./brevo.email.service";
import { EmailVerificationParams, PasswordResetEmailParams } from "./types";
import {
   emailVerificationHtml,
   emailVerificationText,
   passwordResetHtml,
   passwordResetText,
} from "./utils";

const brevoClientMock = BrevoClient as jest.MockedClass<typeof BrevoClient>;

const sendTransacEmailMock = jest.fn().mockResolvedValue({});

brevoClientMock.mockImplementation(
   () =>
      ({
         transactionalEmails: {
            sendTransacEmail: sendTransacEmailMock,
         },
      }) as unknown as BrevoClient
);

const service = new BrevoEmailService();

describe("sendVerificationEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("API error - test", async () => {
      const error = new Error("Brevo API error");
      sendTransacEmailMock.mockRejectedValue(error);

      const params: EmailVerificationParams = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendVerificationEmail(params);

      const expectedRequest: Brevo.SendTransacEmailRequest = {
         to: [
            {
               email: params.to,
               name: params.name,
            },
         ],
         sender: {
            email: getBrevoSenderEmail(),
            name: `${APP_NAME}`,
         },
         subject: `${APP_NAME} – E-Mail-Adresse bestätigen`,
         htmlContent: emailVerificationHtml(
            APP_NAME,
            params.name,
            params.verificationUrl
         ),
         textContent: emailVerificationText(
            APP_NAME,
            params.name,
            params.verificationUrl
         ),
      };

      expect(sendTransacEmailMock).toHaveBeenCalledTimes(1);
      expect(sendTransacEmailMock).toHaveBeenCalledWith(expectedRequest);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("email sent - test", async () => {
      const response = ctestData.brevoSendTransacEmailResponse();
      sendTransacEmailMock.mockResolvedValue(response);

      const params: EmailVerificationParams = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendVerificationEmail(params);

      const expectedRequest: Brevo.SendTransacEmailRequest = {
         to: [
            {
               email: params.to,
               name: params.name,
            },
         ],
         sender: {
            email: getBrevoSenderEmail(),
            name: `${APP_NAME}`,
         },
         subject: `${APP_NAME} – E-Mail-Adresse bestätigen`,
         htmlContent: emailVerificationHtml(
            APP_NAME,
            params.name,
            params.verificationUrl
         ),
         textContent: emailVerificationText(
            APP_NAME,
            params.name,
            params.verificationUrl
         ),
      };

      expect(sendTransacEmailMock).toHaveBeenCalledTimes(1);
      expect(sendTransacEmailMock).toHaveBeenCalledWith(expectedRequest);
   });
});

describe("sendPasswordResetEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("API error - test", async () => {
      const error = new Error("Brevo API error");
      sendTransacEmailMock.mockRejectedValue(error);

      const params: PasswordResetEmailParams = {
         to: "user@example.com",
         name: "Test User",
         resetUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendPasswordResetEmail(params);

      const expectedRequest: Brevo.SendTransacEmailRequest = {
         to: [
            {
               email: params.to,
               name: params.name,
            },
         ],
         sender: {
            email: getBrevoSenderEmail(),
            name: `${APP_NAME}`,
         },
         subject: `${APP_NAME} – Passwort zurücksetzen`,
         htmlContent: passwordResetHtml(APP_NAME, params.name, params.resetUrl),
         textContent: passwordResetText(APP_NAME, params.name, params.resetUrl),
      };

      expect(sendTransacEmailMock).toHaveBeenCalledTimes(1);
      expect(sendTransacEmailMock).toHaveBeenCalledWith(expectedRequest);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("email sent - test", async () => {
      const response = ctestData.brevoSendTransacEmailResponse();
      sendTransacEmailMock.mockResolvedValue(response);

      const params: PasswordResetEmailParams = {
         to: "user@example.com",
         name: "Test User",
         resetUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendPasswordResetEmail(params);

      const expectedRequest: Brevo.SendTransacEmailRequest = {
         to: [
            {
               email: params.to,
               name: params.name,
            },
         ],
         sender: {
            email: getBrevoSenderEmail(),
            name: `${APP_NAME}`,
         },
         subject: `${APP_NAME} – Passwort zurücksetzen`,
         htmlContent: passwordResetHtml(APP_NAME, params.name, params.resetUrl),
         textContent: passwordResetText(APP_NAME, params.name, params.resetUrl),
      };

      expect(sendTransacEmailMock).toHaveBeenCalledTimes(1);
      expect(sendTransacEmailMock).toHaveBeenCalledWith(expectedRequest);
   });
});
