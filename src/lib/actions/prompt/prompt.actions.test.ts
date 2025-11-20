jest.mock("@/db/queries/prompt");

import { getPrompts as getPPrompts } from "@/db/queries/prompt";

import { dbtestData } from "@tests";
import { getPrompts } from "./prompt.actions";
import { toDPrompts } from "./prompt.mapper";

const getPPromptsMock = getPPrompts as jest.MockedFunction<typeof getPPrompts>;

describe("getPromptss tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptss test", async () => {
      const products = dbtestData.pPrompts();
      getPPromptsMock.mockResolvedValue(products);

      const result = await getPrompts();
      const expectedResult = toDPrompts(products);

      expect(result).toEqual(expectedResult);
      expect(getPPromptsMock).toHaveBeenCalledTimes(1);
   });
});
