import { PrismaClient } from "@prisma/client";
import { dbtestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import prisma from "../prisma";
import { getPrompts } from "./prompt";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("getPrompts tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPrompts - prompts retrieved - test", async () => {
      const prompts = dbtestData.pPrompts();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const result = await getPrompts();

      expect(result).toEqual(prompts);
   });
});
