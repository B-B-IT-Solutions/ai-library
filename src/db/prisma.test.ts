jest.mock("./prisma", () => ({
   ...jest.requireActual("./prisma"),
}));

import { assertStringifyEqual } from "@tests";

import { extendsConfig, prisma } from "./prisma";

export const expectedExtendsConfig = {};

describe("prisma tests", () => {
   it("prisma test", async () => {
      expect(prisma).not.toBeNull();
      expect(global.prisma).not.toBeNull();
   });
});

describe("config tests", () => {
   it("extendsConfig test", async () => {
      expect(prisma).not.toBeNull();
      assertStringifyEqual(extendsConfig, expectedExtendsConfig);
   });
});
