import NextAuth from "next-auth";

import { authConfig } from "./auth.config";

export const {
   handlers: expectedHanlders,
   auth: expectedAuth,
   signIn: expectedSignIn,
   signOut: expectedSignOut,
} = NextAuth(authConfig);

import { assertStringifyEqual } from "@tests";

import { auth, handlers, signIn, signOut } from "./auth";

describe("auth tests", () => {
   it("auth test", async () => {
      assertStringifyEqual(auth, expectedAuth);
      assertStringifyEqual(handlers, expectedHanlders);
      assertStringifyEqual(signIn, expectedSignIn);
      assertStringifyEqual(signOut, expectedSignOut);
   });
});
