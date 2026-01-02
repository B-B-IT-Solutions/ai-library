import "@testing-library/jest-dom";
import "whatwg-fetch";
import "intersection-observer";

import failOnConsole from "jest-fail-on-console";
import { mockDeep } from "jest-mock-extended";
import { NextRequest, NextResponse } from "next/server";
import { ReadableStream, TextEncoderStream, TransformStream } from "stream/web";
import { TextDecoder, TextEncoder } from "util";
import { BroadcastChannel } from "worker_threads";

import { PrismaClient } from "@/generated/prisma/client";

jest.mock("next-themes", () => ({
   useTheme: jest.fn().mockReturnValue({ theme: "light", setTheme: jest.fn() }),
   ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("next/headers", () => ({
   __esModule: true,
   cookies: jest.fn(),
   headers: jest.fn(),
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

jest.mock("../src/data/repositories/prisma", () => {
   const prismaMock = mockDeep<PrismaClient>();
   prismaMock.$transaction.mockImplementation((arg: any) => {
      if (Array.isArray(arg)) {
         return Promise.all(arg);
      }
      return arg(prismaMock);
   });

   return {
      __esModule: true,
      default: prismaMock,
   };
});

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

Object.assign(navigator, {
   clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined),
   },
});

class ResizeObserver {
   observe() {}
   unobserve() {}
   disconnect() {}
}

global.ResizeObserver = ResizeObserver;

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
   value: jest.fn(),
});
