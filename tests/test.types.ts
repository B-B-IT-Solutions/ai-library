import type { Session } from "next-auth";

export type AuthMockedFunction = jest.MockedFunction<
   (...args: unknown[]) => Promise<Session | null>
>;
