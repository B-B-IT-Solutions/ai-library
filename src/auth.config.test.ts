jest.mock("@/data/actions/user");
jest.mock("@/lib/encrypt");

import { ntestData, ptestData } from "@tests";
import { forEach } from "es-toolkit/compat";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { CredentialsConfig } from "next-auth/providers/credentials";

import { getUserByEmail, updateUser } from "@/data/actions/user";
import { compare } from "@/lib/encrypt";

import { authConfig } from "./auth.config";

type CredentailsType = Partial<Record<"email" | "password", unknown>>;

type CredentialsConfigExtended = CredentialsConfig & {
   options: Partial<CredentialsConfig>;
};

const getUserByEmailMock = getUserByEmail as jest.MockedFunction<
   typeof getUserByEmail
>;

const updateUserMock = updateUser as jest.MockedFunction<typeof updateUser>;

const compareMock = compare as jest.MockedFunction<typeof compare>;

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
      getUserByEmailMock.mockResolvedValue(null);

      const credentials: CredentailsType = {
         email: "test@example.com",
         password: "password123",
      };
      const request = ntestData.nextRequest();

      const result = await authorize(credentials, request);

      expect(result).toBeNull();
      expect(getUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(getUserByEmailMock).toHaveBeenCalledWith(credentials.email);
   });

   it("authorize - user.password is null - test", async () => {
      const user = ptestData.pUser();
      user.password = null;
      getUserByEmailMock.mockResolvedValue(user);

      const credentials: CredentailsType = {
         email: "test@example.com",
         password: "password123",
      };
      const request = ntestData.nextRequest();

      const result = await authorize(credentials, request);

      expect(result).toBeNull();
      expect(getUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(getUserByEmailMock).toHaveBeenCalledWith(credentials.email);
   });

   it("authorize - user.password compare false - test", async () => {
      const user = ptestData.pUser();
      getUserByEmailMock.mockResolvedValue(user);
      compareMock.mockResolvedValue(false);

      const credentials: CredentailsType = {
         email: "test@example.com",
         password: "password123",
      };
      const request = ntestData.nextRequest();

      const result = await authorize(credentials, request);

      expect(result).toBeNull();
      expect(getUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(getUserByEmailMock).toHaveBeenCalledWith(credentials.email);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(
         credentials.password,
         user.password
      );
   });

   it("authorize - user.password compare true - test", async () => {
      const user = ptestData.pUser();
      getUserByEmailMock.mockResolvedValue(user);
      compareMock.mockResolvedValue(true);

      const credentials: CredentailsType = {
         email: "test@example.com",
         password: "password123",
      };
      const request = ntestData.nextRequest();

      const result = await authorize(credentials, request);

      const expectedResult = {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
      };

      expect(result).toEqual(expectedResult);
      expect(getUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(getUserByEmailMock).toHaveBeenCalledWith(credentials.email);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(
         credentials.password,
         user.password
      );
   });
});

describe("auth.config - callback.authorized - tests", () => {
   const protectedPaths = [
      "/prompts",
      "/templates",
      "/settings",
      "/place-order",
      "/profile",
      "/user/123",
      "/order/456",
      "/admin",
   ];
   const publicPaths = ["/sign-in", "/sign-out"];

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
         expires: new Date(),
      };

      const token = {
         sub: "user-123",
         role: "ADMIN",
         name: "John Doe",
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
   });

   it("session - update user name - test", async () => {
      const session = {
         user: {
            id: "user-123",
            role: "USER",
            name: "Old Name",
         },
      };

      const token = {
         sub: "user-123",
         role: "USER",
         name: "Old Name",
      } as JWT;

      const user = {
         name: "Updated Name",
      } as AdapterUser;

      const result = await sessionCallback?.({
         session,
         token,
         user,
         trigger: "update",
      });

      expect(result.user!.id).toEqual(token.sub);
      expect(result.user!.role).toEqual(token.role);
      expect(result.user!.name).toBe("Updated Name");
   });
});

describe("auth.config - callback.jwt - tests", () => {
   const mockCookies = {
      get: jest.fn().mockReturnValue({ value: "session-cart-id" }),
   } as unknown as ReadonlyRequestCookies;

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
   });

   it("jwt - token updated using user fields - test", async () => {
      const token = {} as JWT;
      const user = {
         id: "user-123",
         role: "ADMIN",
         name: "John Doe",
         email: "john@example.com",
      } as AdapterUser;

      cookiesMock.mockResolvedValue(mockCookies);

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
   });

   it("jwt - generate name from email for user.name NO_NAME - test", async () => {
      const token = {} as JWT;
      const user = {
         id: "user-123",
         role: "USER",
         name: "NO_NAME",
         email: "test@example.com",
      } as AdapterUser;

      cookiesMock.mockResolvedValue(mockCookies);

      const result = await jwtCallback({
         token,
         user,
         trigger: undefined,
         session: undefined,
      });

      expect(result!.name).toBe("test");
      expect(updateUserMock).toHaveBeenCalledTimes(1);
      expect(updateUserMock).toHaveBeenCalledWith(user.id, { name: "test" });
   });

   // it("should retrieve sessionCartId on signIn trigger", async () => {
   //    const mockToken = {} as any;
   //    const mockUser = {
   //       id: "user-123",
   //       role: "USER",
   //       name: "John Doe",
   //       email: "john@example.com",
   //    } as any;

   //    const mockCookies = {
   //       get: jest.fn().mockReturnValue({ value: "cart-123" }),
   //    };
   //    (cookies as jest.Mock).mockResolvedValue(mockCookies);

   //    const result = await jwtCallback?.({
   //       token: mockToken,
   //       user: mockUser,
   //       trigger: "signIn",
   //       session: undefined,
   //    });

   //    expect(mockCookies.get).toHaveBeenCalledWith("sessionCartId");
   //    expect(result?.id).toBe("user-123");
   // });

   // it("should retrieve sessionCartId on signUp trigger", async () => {
   //    const mockToken = {} as any;
   //    const mockUser = {
   //       id: "user-123",
   //       role: "USER",
   //       name: "John Doe",
   //       email: "john@example.com",
   //    } as any;

   //    const mockCookies = {
   //       get: jest.fn().mockReturnValue({ value: "cart-123" }),
   //    };
   //    (cookies as jest.Mock).mockResolvedValue(mockCookies);

   //    const result = await jwtCallback?.({
   //       token: mockToken,
   //       user: mockUser,
   //       trigger: "signUp",
   //       session: undefined,
   //    });

   //    expect(mockCookies.get).toHaveBeenCalledWith("sessionCartId");
   //    expect(result?.id).toBe("user-123");
   // });

   // it("should update token name on update trigger", async () => {
   //    const mockToken = {
   //       name: "Old Name",
   //    } as any;

   //    const mockSession = {
   //       user: {
   //          name: "New Name",
   //       },
   //    } as any;

   //    const result = await jwtCallback?.({
   //       token: mockToken,
   //       user: undefined,
   //       trigger: "update",
   //       session: mockSession,
   //    });

   //    expect(result?.name).toBe("New Name");
   // });

   // it("should not update token when no user or session update", async () => {
   //    const mockToken = {
   //       sub: "user-123",
   //       role: "USER",
   //       name: "John Doe",
   //    } as any;

   //    const result = await jwtCallback?.({
   //       token: mockToken,
   //       user: undefined,
   //       trigger: undefined,
   //       session: undefined,
   //    });

   //    expect(result).toEqual(mockToken);
   // });
});
