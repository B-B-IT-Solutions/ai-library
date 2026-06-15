import type { Session } from "next-auth";

export type AuthMockedFunction = jest.MockedFunction<
   (...args: unknown[]) => Promise<Session | null>
>;

type V4Signature = () => string;

export type UuidV4MockedFunction = jest.MockedFunction<V4Signature>;
