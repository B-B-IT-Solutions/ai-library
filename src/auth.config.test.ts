jest.mock("@/data/services/user");
jest.mock("@/data/actions/cart");
jest.mock("@/data/services/subscription");

import { ntestData, ptestData } from "@tests";
import { forEach } from "es-toolkit/compat";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { CredentialsConfig } from "next-auth/providers/credentials";

import { migrateSessionCartToUser } from "@/data/actions/cart";
import { SubscriptionService } from "@/data/services/subscription";
import { UserService } from "@/data/services/user";
import { DSubscriptionTier } from "@/data/types/domain/subscription";

import { authConfig } from "./auth.config";

type CredentailsType = Partial<Record<"email" | "password", unknown>>;

type CredentialsConfigExtended = CredentialsConfig & {
   options: Partial<CredentialsConfig>;
};

const sSingInUser = UserService.prototype.singInUser;
const sUpdateUser = UserService.prototype.updateUser;

const sSingInUserMock = sSingInUser as jest.MockedFunction<typeof sSingInUser>;

const sUpdateUserMock = sUpdateUser as jest.MockedFunction<typeof sUpdateUser>;

const sGetUserTier = SubscriptionService.prototype.getUserTier;

const sGetUserTierMock = sGetUserTier as jest.MockedFunction<
   typeof sGetUserTier
>;

const migrateSessionCartToUserMock =
   migrateSessionCartToUser as jest.MockedFunction<
      typeof migrateSessionCartToUser
   >;

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;

const nextMock = NextResponse.next as jest.MockedFunction<
   typeof NextResponse.next
>;

const expectePagesConfig = {
   signIn: "/sign-in",
   error: "/sign-in",
};

const expectedSessionConfig = {
   strategy: "jwt" as const,
   maxAge: 30 * 24 * 60 * 60,
};

describe("auth.config - basic configurations - tests", () => {
   it("auth.config - basic configuration - test", () => {
      expect(authConfig.pages).toEqual(expectePagesConfig);
      expect(authConfig.session).toEqual(expectedSessionConfig);
   });

   it("auth.config - providers config test - test", () => {
      expect(authConfig.providers).toBeDefined();
      expect(Array.isArray(authConfig.providers)).toBe(true);
      expect(authConfig.providers).toHaveLength(1);
   });
});

describe("auth.config - CredentialsProvider - tests", () => {
   const credentialsProvider = authConfig
      .providers[0] as CredentialsConfigExtended;
   const authorize = credentialsProvider.options.authorize!;

   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("provider - options.credentials - test", async () => {
      const credentialsOptions = {
         email: { type: "email" },
         password: { type: "password" },
      };

      expect(credentialsProvider.options.credentials).toEqual(
         credentialsOptions
      );
   });

   it("authorize - credentials null - test", async () => {
      const credentials = null as unknown as CredentailsType;
      const request = ntestData.nextRequest();

      const result = await authorize(credentials, request);
      expect(result).toBeNull();
   });

   it("authorize - user null - test", async () => {
      sSingInUserMock.mockResolvedValue(null);

      const credentials: CredentailsType = {
         email: "test@example.com",
         password: "password123",
      };
      const request = ntestData.nextRequest();

      const result = await authorize(credentials, request);

      expect(result).toBeNull();
      expect(sSingInUserMock).toHaveBeenCalledTimes(1);
      expect(sSingInUserMock).toHaveBeenCalledWith(credentials);
   });

   it("authorize - user logged in - test", async () => {
      const user = ptestData.pUser();
      const loggedInUser = {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
      };

      sSingInUserMock.mockResolvedValue(loggedInUser);

      const credentials: CredentailsType = {
         email: "test@example.com",
         password: "password123",
      };
      const request = ntestData.nextRequest();

      const result = await authorize(credentials, request);

      expect(result).toEqual(loggedInUser);
      expect(sSingInUserMock).toHaveBeenCalledTimes(1);
      expect(sSingInUserMock).toHaveBeenCalledWith(credentials);
   });
});

describe("auth.config - callback.authorized - tests", () => {
   const protectedPaths = [
      "/prompts",
      "/marketplace",
      "/products/123",
      "/library",
      "/checkout",
      "/settings",
      "/profile",
      "/user/123",
      "/orders/456",
      "/admin",
   ];
   const publicPaths = ["/sign-in", "/sign-out", "/p/marketplace"];

   const authorized = authConfig.callbacks!.authorized!;

   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("authorized - protected path access without authentication blocked- test", () => {
      forEach(protectedPaths, (path) => {
         const request = {
            nextUrl: { pathname: path },
            cookies: {
               get: jest.fn(),
            },
         } as unknown as NextRequest;

         const result = authorized({ request, auth: null });
         expect(result).toBe(false);
      });
   });

   it("authorized - protected path access with authentication allowed - test", () => {
      forEach(protectedPaths, (path) => {
         const request = {
            nextUrl: { pathname: path },
            cookies: {
               get: jest.fn().mockReturnValue({ value: "session-id" }),
               set: jest.fn(),
            },
         } as unknown as NextRequest;

         const auth = {
            user: { id: "user-1", email: "test@example.com" },
         } as Session;

         const result = authorized({ request, auth });
         expect(result).toBe(true);
      });
   });

   it("authorized - public path access without authentication allowed - test", () => {
      forEach(publicPaths, (path) => {
         const request = {
            nextUrl: { pathname: path },
            cookies: {
               get: jest.fn().mockReturnValue({ value: "session-id" }),
            },
         } as unknown as NextRequest;

         const result = authorized({ request, auth: null });
         expect(result).toBe(true);
      });
   });

   it("authorized - sessionCartId undefined - test", () => {
      const mockResponse = {
         cookies: {
            set: jest.fn(),
         },
      } as unknown as NextResponse;
      nextMock.mockReturnValue(mockResponse);

      const request = {
         nextUrl: { pathname: "/public" },
         cookies: { get: jest.fn().mockReturnValue(undefined) },
         headers: new Headers({ "header-1": "value-1" }),
      } as unknown as NextRequest;

      const auth = {
         user: { id: "user-1" },
      } as Session;

      const result = authorized({ request, auth });

      const expectedResponseInit = {
         request: {
            headers: new Headers(request.headers),
         },
      };

      expect(result).toEqual(mockResponse);
      expect(request.cookies.get).toHaveBeenCalledTimes(1);
      expect(request.cookies.get).toHaveBeenCalledWith("sessionCartId");
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(expectedResponseInit);
      expect(mockResponse.cookies.set).toHaveBeenCalledWith(
         "sessionCartId",
         expect.any(String)
      );
   });

   it("authorized - sessionCartId defined - test", () => {
      const request = {
         nextUrl: { pathname: "/public" },
         cookies: {
            get: jest.fn().mockReturnValue({ value: "existing-cart-id" }),
         },
         headers: new Headers(),
      } as unknown as NextRequest;

      const auth = {
         user: { id: "user-1" },
      } as Session;

      const result = authorized({ request, auth });

      expect(result).toEqual(true);
      expect(request.cookies.get).toHaveBeenCalledTimes(1);
      expect(request.cookies.get).toHaveBeenCalledWith("sessionCartId");
      expect(nextMock).not.toHaveBeenCalled();
   });
});

describe("auth.config - callback.session - tests", () => {
   const sessionCallback = authConfig.callbacks!.session!;

   it("session - populate user from token - test", async () => {
      const session = {
         user: ntestData.adapterUser(),
         sessionToken: "token-1",
         userId: "1",
         expires: new Date().toISOString(),
      };

      const token = {
         sub: "user-123",
         role: "ADMIN",
         name: "John Doe",
         tier: "PRO",
      } as JWT;

      const result = await sessionCallback({
         session: session,
         token: token,
         user: {} as AdapterUser,
         trigger: undefined,
      });

      expect(result.user!.id).toEqual(token.sub);
      expect(result.user!.role).toEqual(token.role);
      expect(result.user!.name).toEqual(token.name);
      expect(result.user!.tier).toEqual(token.tier);
   });

   it("session - update user name - test", async () => {
      const session = {
         user: {
            id: "",
            role: "",
            name: "Old Name",
            tier: "",
            email: "test1@email.cz",
            emailVerified: new Date(),
         },
      };

      const token = {
         sub: "user-123",
         role: "USER",
         name: "Old Name",
         tier: "BASIC",
      } as JWT;

      const user = {
         name: "Updated Name",
      } as AdapterUser;

      const result = await sessionCallback({
         session,
         token,
         user,
         trigger: "update",
      });

      expect(result.user!.id).toEqual(token.sub);
      expect(result.user!.role).toEqual(token.role);
      expect(result.user!.name).toBe("Updated Name");
      expect(result.user!.tier).toEqual(token.tier);
   });
});

describe("auth.config - callback.jwt - tests", () => {
   const jwtCallback = authConfig.callbacks!.jwt!;

   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("jwt - user null - test", async () => {
      const token = {} as JWT;
      const user = null as unknown as AdapterUser;

      const result = await jwtCallback({
         token,
         user,
         trigger: undefined,
         session: undefined,
      });

      expect(result).toEqual(token);
      expect(sGetUserTierMock).not.toHaveBeenCalled();
      expect(sUpdateUserMock).not.toHaveBeenCalled();
   });

   it("jwt - token updated using user fields - test", async () => {
      const tier: DSubscriptionTier = "FREE";
      const token = {} as JWT;
      const user = {
         id: "user-123",
         role: "ADMIN",
         name: "John Doe",
         email: "john@example.com",
      } as AdapterUser;

      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      sGetUserTierMock.mockResolvedValue(tier);

      const result = await jwtCallback({
         token,
         user,
         trigger: undefined,
         session: undefined,
      });

      expect(result!.id).toBeDefined();
      expect(result!.id).toEqual(user.id);
      expect(result!.role).toBeDefined();
      expect(result!.role).toEqual(user.role);
      expect(result!.tier).toEqual(tier);
      expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
      expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
      expect(sUpdateUserMock).not.toHaveBeenCalled();
   });

   it("jwt - generate name from email for user.name NO_NAME - test", async () => {
      const tier: DSubscriptionTier = "BASIC";
      const token = {} as JWT;
      const user = {
         id: "user-123",
         role: "USER",
         name: "NO_NAME",
         email: "test@example.com",
      } as AdapterUser;

      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      sGetUserTierMock.mockResolvedValue(tier);

      const result = await jwtCallback({
         token,
         user,
         trigger: undefined,
         session: undefined,
      });

      expect(result!.name).toBe("test");
      expect(result!.tier).toEqual(tier);
      expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
      expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
      expect(sUpdateUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserMock).toHaveBeenCalledWith(user.id, { name: "test" });
   });

   it("jwt - trigger signIn - sessionCartId defined - test", async () => {
      const tier: DSubscriptionTier = "PRO";
      const token = {} as JWT;
      const userId = "user-123";
      const sessionCartId = "sessionCartId-1";
      const user = {
         id: userId,
         role: "USER",
         name: "John Doe",
         email: "john@example.com",
      } as AdapterUser;

      const cookies = { sessionCartId };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);
      sGetUserTierMock.mockResolvedValue(tier);

      const result = await jwtCallback({
         token: token,
         user: user,
         trigger: "signIn",
         session: undefined,
      });

      expect(result!.id).toBe(user.id);
      expect(result!.role).toBe(user.role);
      expect(result!.tier).toBe(tier);
      expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
      expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
      expect(migrateSessionCartToUserMock).toHaveBeenCalledTimes(1);
      expect(migrateSessionCartToUserMock).toHaveBeenCalledWith(
         sessionCartId,
         userId
      );
   });

   it("jwt - trigger signIn - sessionCartId undefined - test", async () => {
      const tier: DSubscriptionTier = "PRO";
      const token = {} as JWT;
      const userId = "user-123";
      const user = {
         id: userId,
         role: "USER",
         name: "John Doe",
         email: "john@example.com",
      } as AdapterUser;

      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      sGetUserTierMock.mockResolvedValue(tier);

      const result = await jwtCallback({
         token: token,
         user: user,
         trigger: "signIn",
         session: undefined,
      });

      expect(result!.id).toBe(user.id);
      expect(result!.role).toBe(user.role);
      expect(result!.tier).toBe(tier);
      expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
      expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
      expect(migrateSessionCartToUserMock).not.toHaveBeenCalled();
   });

   it("jwt - trigger signUp - sessionCartId defined - test", async () => {
      const tier: DSubscriptionTier = "PRO";
      const token = {} as JWT;
      const userId = "user-789";
      const sessionCartId = "sessionCartId-1";
      const user = {
         id: userId,
         role: "USER_1",
         name: "John Doe",
         email: "john@example.com",
      } as AdapterUser;

      const cookies = { sessionCartId };
      const reqCookies = ntestData.cookies(cookies);
      cookiesMock.mockResolvedValue(reqCookies);
      sGetUserTierMock.mockResolvedValue(tier);

      const result = await jwtCallback({
         token: token,
         user: user,
         trigger: "signUp",
         session: undefined,
      });

      expect(result!.id).toBe(user.id);
      expect(result!.role).toBe(user.role);
      expect(result!.tier).toBe(tier);
      expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
      expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
      expect(migrateSessionCartToUserMock).toHaveBeenCalledTimes(1);
      expect(migrateSessionCartToUserMock).toHaveBeenCalledWith(
         sessionCartId,
         userId
      );
   });

   it("jwt - trigger signUp - sessionCartId undefined - test", async () => {
      const tier: DSubscriptionTier = "PRO";
      const token = {} as JWT;
      const userId = "user-789";
      const user = {
         id: userId,
         role: "USER_1",
         name: "John Doe",
         email: "john@example.com",
      } as AdapterUser;

      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      sGetUserTierMock.mockResolvedValue(tier);

      const result = await jwtCallback({
         token: token,
         user: user,
         trigger: "signUp",
         session: undefined,
      });

      expect(result!.id).toBe(user.id);
      expect(result!.role).toBe(user.role);
      expect(result!.tier).toBe(tier);
      expect(sGetUserTierMock).toHaveBeenCalledTimes(1);
      expect(sGetUserTierMock).toHaveBeenCalledWith(user.id);
      expect(migrateSessionCartToUserMock).not.toHaveBeenCalled();
   });

   it("jwt - trigger update - test", async () => {
      const token = {
         name: "Old Name",
      } as JWT;

      const session = {
         user: {
            name: "New Name",
         },
      };

      const result = await jwtCallback({
         token: token,
         session: session,
         user: null as unknown as AdapterUser,
         trigger: "update",
      });

      expect(result!.name).toEqual("New Name");
      expect(migrateSessionCartToUserMock).not.toHaveBeenCalled();
   });
});
