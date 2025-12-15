import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { Account, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { DefaultJWT } from "next-auth/jwt";
import { SessionContextValue } from "next-auth/react";

import { User } from "@/generated/prisma/client";

import {
   CookieValues,
   MockReadonlyRequestCookies,
} from "./stubs/MockReadonlyRequestCookies";

export const cookies = (cookies: CookieValues): ReadonlyRequestCookies => {
   return new MockReadonlyRequestCookies(
      cookies
   ) as unknown as ReadonlyRequestCookies;
};

export const nextRequest = (body: object): NextRequest => {
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
      user: user(),
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
      image: "/image-1.png",
      password: "password123",
      paymentMethod: "stripe",
      emailVerified: new Date("2025-09-27"),
      role: "user",
      createdAt: new Date("2025-09-27"),
      updatedAt: new Date("2025-09-27"),
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
