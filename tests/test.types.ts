import type { Session } from "next-auth";

export type AuthMockType = jest.MockedFunction<
   (...args: unknown[]) => Promise<Session | null>
>;
