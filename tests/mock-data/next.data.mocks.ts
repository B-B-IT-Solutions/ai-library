import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

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
