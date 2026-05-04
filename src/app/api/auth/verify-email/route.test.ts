jest.mock("@/data/services");
jest.mock("@/data/repositories/prisma");

import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { ServiceFactory } from "@/data/services";
import { UserService } from "@/data/services/user";
import { VerificationTokenService } from "@/data/services/verification-token";

import { GET } from "./route";

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;
const ServiceFactoryMock = ServiceFactory as jest.MockedClass<
   typeof ServiceFactory
>;
const requestMock = NextRequest as unknown as DeepMockProxy<NextRequest>;

const tokenServiceMock = mockDeep<VerificationTokenService>();
const userServiceMock = mockDeep<UserService>();

const setupSearchParams = (params: Record<string, string | null>) => {
   requestMock.nextUrl.searchParams.get.mockImplementation(
      (key: string) => params[key] ?? null
   );
};

describe("GET /api/auth/verify-email tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      ServiceFactoryMock.prototype.getVerificationTokenService.mockReturnValue(
         tokenServiceMock
      );
      ServiceFactoryMock.prototype.getUserService.mockReturnValue(
         userServiceMock
      );
   });

   it("GET - missing token - redirects to invalid_link - test", async () => {
      setupSearchParams({ token: null, email: "user@test.com" });

      await GET(requestMock);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
      expect(
         ServiceFactoryMock.prototype.getVerificationTokenService
      ).not.toHaveBeenCalled();
   });

   it("GET - missing email - redirects to invalid_link - test", async () => {
      setupSearchParams({ token: "abc-123", email: null });

      await GET(requestMock);

      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=invalid_link"
      );
      expect(
         ServiceFactoryMock.prototype.getVerificationTokenService
      ).not.toHaveBeenCalled();
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
      tokenServiceMock.verifyToken.mockResolvedValue(false);

      await GET(requestMock);

      expect(tokenServiceMock.verifyToken).toHaveBeenCalledTimes(1);
      expect(tokenServiceMock.verifyToken).toHaveBeenCalledWith(email, token);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         "/auth/sign-in?error=expired_link"
      );
      expect(userServiceMock.verifyEmail).not.toHaveBeenCalled();
   });

   it("GET - valid token - verifies email and redirects to verified - test", async () => {
      const email = "user@test.com";
      const token = "valid-token";

      setupSearchParams({ token, email });
      tokenServiceMock.verifyToken.mockResolvedValue(true);
      userServiceMock.verifyEmail.mockResolvedValue(undefined);

      await GET(requestMock);

      expect(tokenServiceMock.verifyToken).toHaveBeenCalledTimes(1);
      expect(tokenServiceMock.verifyToken).toHaveBeenCalledWith(email, token);
      expect(userServiceMock.verifyEmail).toHaveBeenCalledTimes(1);
      expect(userServiceMock.verifyEmail).toHaveBeenCalledWith(email);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in?verified=true");
   });
});
