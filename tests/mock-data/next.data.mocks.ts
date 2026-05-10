import { NextURL } from "next/dist/server/web/next-url";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { ReadonlyURLSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { Account, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { DefaultJWT } from "next-auth/jwt";
import { SessionContextValue } from "next-auth/react";

import {
   CookieValues,
   MockReadonlyRequestCookies,
} from "./stubs/MockReadonlyRequestCookies";

export const urlSearchParams = (
   params: Record<string, string> = {}
): ReadonlyURLSearchParams => {
   return new URLSearchParams(params) as ReadonlyURLSearchParams;
};

export const cookies = (cookies: CookieValues): ReadonlyRequestCookies => {
   return new MockReadonlyRequestCookies(
      cookies
   ) as unknown as ReadonlyRequestCookies;
};

export const headers = (init: HeadersInit = {}): ReadonlyHeaders => {
   return new Headers(init);
};

export const nextURL = (params: Record<string, string> = {}): NextURL => {
   const searchParams = new URLSearchParams(params);
   return {
      searchParams,
   } as NextURL;
};

export const nextRequest = (
   nextUrl = nextURL(),
   body: object = {}
): NextRequest => {
   return {
      nextUrl,
      json: async () => body,
   } as NextRequest;
};

export const nextResponse = (
   status = 200,
   headers = new Headers()
): NextResponse => {
   return {
      status,
      headers,
   } as NextResponse;
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
