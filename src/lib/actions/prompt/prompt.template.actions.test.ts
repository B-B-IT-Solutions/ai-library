jest.mock("@/db/queries/prompt.template");

import { ptestData } from "@tests";

import { getPromptTemplates as pGetPromptTemplates } from "@/db/queries/prompt.template";

import { toDPromptTemplates } from "./prompt.mapper";
import { getPromptTemplates } from "./prompt.template.actions";

const pGetPromptTemplatesMock = pGetPromptTemplates as jest.MockedFunction<
   typeof pGetPromptTemplates
>;

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptTemplates test", async () => {
      const templates = ptestData.pPromptTemplates();
      pGetPromptTemplatesMock.mockResolvedValue(templates);

      const result = await getPromptTemplates();
      const expectedResult = toDPromptTemplates(templates);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledTimes(1);
   });
});
