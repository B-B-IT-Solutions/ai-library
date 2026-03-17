import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { Account, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { DefaultJWT } from "next-auth/jwt";
import { SessionContextValue } from "next-auth/react";

import {
   CookieValues,
   MockReadonlyRequestCookies,
} from "./stubs/MockReadonlyRequestCookies";

export const cookies = (cookies: CookieValues): ReadonlyRequestCookies => {
   return new MockReadonlyRequestCookies(
      cookies
   ) as unknown as ReadonlyRequestCookies;
};

export const headers = (init: HeadersInit = {}): ReadonlyHeaders => {
   return new Headers(init);
};

export const nextRequest = (body: object = {}): NextRequest => {
   return {
      json: async () => body,
   } as NextRequest;
};

export const sessionContextValue = (
   mockSession: Session | null = session()
): SessionContextValue => {
   if (session === null) {
      return {
         update: jest.fn(),
         data: null,
         status: "loading",
      };
   }
   return {
      update: jest.fn(),
      data: mockSession as Session,
      status: "authenticated",
   };
};

export const session = (): Session => {
   return {
      expires: "1759362132477",
      user: {
         id: "test1@email.com",
         email: "test1@email.com",
         name: "User Name 1",
         role: "user",
         tier: "FREE",
      },
   };
};

export const adapterUser = (): AdapterUser => {
   return {
      id: "user-1",
      email: "test1@email.com",
      emailVerified: new Date("2025-09-27"),
      role: "user",
   };
};

export const user = (): User => {
   return {
      id: "test1@email.com",
      email: "test1@email.com",
      name: "User Name 1",
      role: "user",
   };
};

export const account = (): Account => {
   return {
      providerAccountId: "account-1",
      userId: "user-1",
      provider: "google",
      type: "oauth",
   };
};

export const defaultJWT = (): DefaultJWT => {
   return {
      email: "test1@email.com",
      name: "name 1",
   };
};
