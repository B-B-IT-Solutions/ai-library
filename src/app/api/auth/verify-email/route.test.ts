jest.mock("@/data/services/verification-token");
jest.mock("@/data/services/user");

import { ntestData } from "@tests";
import { redirect } from "next/navigation";

import { UserService } from "@/data/services/user";
import { VerificationTokenService } from "@/data/services/verification-token";

import { GET } from "./route";

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const sVerifyToken = VerificationTokenService.prototype.verifyToken;
const sVerifyEmail = UserService.prototype.verifyEmail;

const sVerifyTokenMock = sVerifyToken as jest.MockedFunction<
   typeof sVerifyToken
>;
const sVerifyEmailMock = sVerifyEmail as jest.MockedFunction<
   typeof sVerifyEmail
>;

describe("GET /api/auth/verify-email tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GET - missing token and email - redirects to invalid_link - test", async () => {
      const token = "";
      const email = "";
      const nextUrl = ntestData.nextURL({ token, email });
      const request = ntestData.nextRequest(nextUrl);

      await GET(request);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
      expect(sVerifyTokenMock).not.toHaveBeenCalled();
      expect(sVerifyEmailMock).not.toHaveBeenCalled();
   });

   it("GET - missing token - redirects to invalid_link - test", async () => {
      const token = "";
      const email = "user@test.com";
      const nextUrl = ntestData.nextURL({ token, email });
      const request = ntestData.nextRequest(nextUrl);

      await GET(request);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
      expect(sVerifyTokenMock).not.toHaveBeenCalled();
      expect(sVerifyEmailMock).not.toHaveBeenCalled();
   });

   it("GET - missing email - redirects to invalid_link - test", async () => {
      const token = "abc-123";
      const email = "";
      const nextUrl = ntestData.nextURL({ token, email });
      const request = ntestData.nextRequest(nextUrl);

      await GET(request);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
      expect(sVerifyTokenMock).not.toHaveBeenCalled();
      expect(sVerifyEmailMock).not.toHaveBeenCalled();
   });

   it("GET - invalid token - redirects to expired_link - test", async () => {
      const token = "invalid-token";
      const email = "user@test.com";
      const nextUrl = ntestData.nextURL({ token, email });
      const request = ntestData.nextRequest(nextUrl);

      sVerifyTokenMock.mockResolvedValue(false);

      await GET(request);

      expect(sVerifyTokenMock).toHaveBeenCalledTimes(1);
      expect(sVerifyTokenMock).toHaveBeenCalledWith(email, token);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=expired_link"
      );
      expect(sVerifyEmailMock).not.toHaveBeenCalled();
   });

   it("GET - valid token - verifies email and redirects to verified - test", async () => {
      const token = "valid-token";
      const email = "user@test.com";
      const nextUrl = ntestData.nextURL({ token, email });
      const request = ntestData.nextRequest(nextUrl);

      sVerifyTokenMock.mockResolvedValue(true);
      sVerifyEmailMock.mockResolvedValue(undefined);

      await GET(request);

      expect(sVerifyTokenMock).toHaveBeenCalledTimes(1);
      expect(sVerifyTokenMock).toHaveBeenCalledWith(email, token);
      expect(sVerifyEmailMock).toHaveBeenCalledTimes(1);
      expect(sVerifyEmailMock).toHaveBeenCalledWith(email);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in?verified=true");
   });
});
