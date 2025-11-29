import "@testing-library/jest-dom";
import "whatwg-fetch";

import failOnConsole from "jest-fail-on-console";
import { mockDeep } from "jest-mock-extended";
import { NextRequest, NextResponse } from "next/server";
import mockRouter from "next-router-mock";
import { ReadableStream, TextEncoderStream, TransformStream } from "stream/web";
import { TextDecoder, TextEncoder } from "util";
import { BroadcastChannel } from "worker_threads";

import { PrismaClient } from "@/generated/prisma/client";

jest.mock("next/navigation", () => ({
   ...jest.requireActual("next-router-mock"),
   useRouter: () => mockRouter,
   usePathname() {
      return mockRouter.pathname;
   },
   useSearchParams: jest.fn(() => {
      if (mockRouter.query) {
         const params = mockRouter.query as unknown as URLSearchParams;
         return new URLSearchParams(params);
      }
      return new URLSearchParams("");
   }),
   useServerInsertedHTML: jest.fn(),
   redirect: jest.fn(),
   notFound: jest.fn(),
}));

jest.mock("next-themes", () => ({
   useTheme: jest.fn().mockReturnValue({ theme: "light", setTheme: jest.fn() }),
   ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("next/headers", () => ({
   __esModule: true,
   cookies: jest.fn(),
}));

jest.mock("next/cache", () => ({
   __esModule: true,
   revalidatePath: jest.fn(),
}));

jest.mock("next/server", () => ({
   __esModule: true,
   NextRequest: mockDeep<NextRequest>({ funcPropSupport: true }),
   NextResponse: mockDeep<NextResponse>({ funcPropSupport: true }),
}));

jest.mock("../src/data/db/prisma", () => ({
   __esModule: true,
   default: mockDeep<PrismaClient>(),
}));

failOnConsole();

global.fetch = jest.fn();

Object.assign(global, {
   TextEncoder,
   TextDecoder,
   TransformStream,
   ReadableStream,
   TextEncoderStream,
   BroadcastChannel,
   ResizeObserver: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
   })),
});

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
   value: jest.fn(),
});
