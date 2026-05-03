jest.mock("@getbrevo/brevo");
jest.mock("@/lib/constants", () => ({
   ...jest.requireActual("@/lib/constants"),
   getBrevoApiKey: jest.fn().mockReturnValue("test-api-key"),
   getBrevoSenderEmail: jest.fn().mockReturnValue("noreply@test.com"),
   APP_NAME: "Vision Notes",
}));

import { BrevoClient } from "@getbrevo/brevo";

import { BrevoEmailService } from "./brevo.email.service";

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
   let service: BrevoEmailService;

   beforeEach(() => {
      jest.clearAllMocks();
      service = new BrevoEmailService();
   });

   it("sendVerificationEmail - sends email with correct params - test", async () => {
      const params = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await service.sendVerificationEmail(params);

      expect(sendTransacEmailMock).toHaveBeenCalledTimes(1);
      expect(sendTransacEmailMock).toHaveBeenCalledWith(
         expect.objectContaining({
            to: [{ email: params.to, name: params.name }],
            sender: expect.objectContaining({ email: "noreply@test.com" }),
            subject: expect.stringContaining("E-Mail-Adresse bestätigen"),
            htmlContent: expect.stringContaining(params.verificationUrl),
            textContent: expect.stringContaining(params.verificationUrl),
         })
      );
   });

   it("sendVerificationEmail - throws error on failure - test", async () => {
      sendTransacEmailMock.mockRejectedValue(new Error("Brevo API error"));
      const params = {
         to: "user@example.com",
         name: "Test User",
         verificationUrl: "https://example.com/verify?token=abc123",
      };

      await expect(service.sendVerificationEmail(params)).rejects.toThrow(
         "Brevo API error"
      );
   });
});
