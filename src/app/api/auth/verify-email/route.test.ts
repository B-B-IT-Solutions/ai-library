jest.mock("@/data/services/verification-token");
jest.mock("@/data/services/user");

import { DeepMockProxy } from "jest-mock-extended";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { UserService } from "@/data/services/user";
import { VerificationTokenService } from "@/data/services/verification-token";

import { GET } from "./route";

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const requestMock = NextRequest as unknown as DeepMockProxy<NextRequest>;

const sVerifyToken = VerificationTokenService.prototype.verifyToken;
const sVerifyEmail = UserService.prototype.verifyEmail;

const sVerifyTokenMock = sVerifyToken as jest.MockedFunction<
   typeof sVerifyToken
>;
const sVerifyEmailMock = sVerifyEmail as jest.MockedFunction<
   typeof sVerifyEmail
>;

const setupSearchParams = (params: Record<string, string | null>) => {
   requestMock.nextUrl.searchParams.get.mockImplementation(
      (key: string) => params[key] ?? null
   );
};

describe("GET /api/auth/verify-email tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GET - missing token - redirects to invalid_link - test", async () => {
      setupSearchParams({ token: null, email: "user@test.com" });

      await GET(requestMock);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
      expect(sVerifyTokenMock).not.toHaveBeenCalled();
   });

   it("GET - missing email - redirects to invalid_link - test", async () => {
      setupSearchParams({ token: "abc-123", email: null });

      await GET(requestMock);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
      expect(sVerifyTokenMock).not.toHaveBeenCalled();
   });

   it("GET - missing token and email - redirects to invalid_link - test", async () => {
      setupSearchParams({ token: null, email: null });

      await GET(requestMock);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
   });

   it("GET - invalid token - redirects to expired_link - test", async () => {
      const email = "user@test.com";
      const token = "invalid-token";

      setupSearchParams({ token, email });
      sVerifyTokenMock.mockResolvedValue(false);

      await GET(requestMock);

      expect(sVerifyTokenMock).toHaveBeenCalledTimes(1);
      expect(sVerifyTokenMock).toHaveBeenCalledWith(email, token);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=expired_link"
      );
      expect(sVerifyEmailMock).not.toHaveBeenCalled();
   });

   it("GET - valid token - verifies email and redirects to verified - test", async () => {
      const email = "user@test.com";
      const token = "valid-token";

      setupSearchParams({ token, email });
      sVerifyTokenMock.mockResolvedValue(true);
      sVerifyEmailMock.mockResolvedValue(undefined);

      await GET(requestMock);

      expect(sVerifyTokenMock).toHaveBeenCalledTimes(1);
      expect(sVerifyTokenMock).toHaveBeenCalledWith(email, token);
      expect(sVerifyEmailMock).toHaveBeenCalledTimes(1);
      expect(sVerifyEmailMock).toHaveBeenCalledWith(email);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in?verified=true");
   });
});
