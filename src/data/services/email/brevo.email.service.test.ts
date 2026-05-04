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

describe("BrevoEmailService tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("sendVerificationEmail - sends email with correct params - test", async () => {
      const params: EmailVerificationParams = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      const service = new BrevoEmailService();
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
      sendTransacEmailMock.mockRejectedValue(new Error("Brevo API error"));
      const params = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      const service = new BrevoEmailService();
      await expect(service.sendVerificationEmail(params)).rejects.toThrow(
         "Brevo API error"
      );
   });
});
