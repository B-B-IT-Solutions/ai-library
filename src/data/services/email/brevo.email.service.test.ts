jest.mock("@getbrevo/brevo");

import { Brevo, BrevoClient } from "@getbrevo/brevo";

import { APP_NAME, getBrevoSenderEmail } from "@/lib/constants";

import { BrevoEmailService } from "./brevo.email.service";
import { EmailVerificationParams } from "./types";
import { buildHtml, buildText } from "./utils";

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

describe("BrevoEmailService tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("sendVerificationEmail - sends email with correct params - test", async () => {
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
         htmlContent: buildHtml(APP_NAME, params.name, params.verificationUrl),
         textContent: buildText(APP_NAME, params.name, params.verificationUrl),
      };

      expect(sendTransacEmailMock).toHaveBeenCalledTimes(1);
      expect(sendTransacEmailMock).toHaveBeenCalledWith(expectedRequest);
   });

   it("sendVerificationEmail - throws error on failure - test", async () => {
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
         htmlContent: buildHtml(APP_NAME, params.name, params.verificationUrl),
         textContent: buildText(APP_NAME, params.name, params.verificationUrl),
      };

      expect(sendTransacEmailMock).toHaveBeenCalledTimes(1);
      expect(sendTransacEmailMock).toHaveBeenCalledWith(expectedRequest);
      expect(console.error).toHaveBeenCalledTimes(1);
   });
});
