jest.mock("@/db/queries/prompt");

import {
   getPrompts as pGetPrompts,
   createPrompt as pCreatePrompt,
} from "@/db/queries/prompt";

import { dtestData, ptestData } from "@tests";
import { createPrompt, getPrompts } from "./prompt.actions";
import { toDPrompts } from "./prompt.mapper";

const pGetPromptsMock = pGetPrompts as jest.MockedFunction<typeof pGetPrompts>;
const pCreatePromptMock = pCreatePrompt as jest.MockedFunction<
   typeof pCreatePrompt
>;

describe("getPromptss tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptss test", async () => {
      const products = ptestData.pPrompts();
      pGetPromptsMock.mockResolvedValue(products);

      const result = await getPrompts();
      const expectedResult = toDPrompts(products);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptsMock).toHaveBeenCalledTimes(1);
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createPrompt - error - test", async () => {
      const prompt = dtestData.pPrompt();
      pCreatePromptMock.mockRejectedValue(new Error("db error"));

      const result = await createPrompt(prompt);
      const expectedResult = {
         success: false,
         message: "db error",
      };
      const promptToSave = {
         title: prompt.title,
         content: prompt.content,
         categories: prompt.categories,
         recommendedModel: prompt.recommendedModel,
         followUpPrompts: prompt.followUpPrompts,
         currentVersion: 1,
      };

      expect(result).toEqual(expectedResult);
      expect(pCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(pCreatePromptMock).toHaveBeenCalledWith(promptToSave);
   });

   it("createPrompt - prompt created  - test", async () => {
      const prompt = dtestData.pPrompt();

      const result = await createPrompt(prompt);
      const expectedResult = {
         success: true,
         message: "Prompt created sucessfully.",
      };
      const promptToSave = {
         title: prompt.title,
         content: prompt.content,
         categories: prompt.categories,
         recommendedModel: prompt.recommendedModel,
         followUpPrompts: prompt.followUpPrompts,
         currentVersion: 1,
      };

      expect(result).toEqual(expectedResult);
      expect(pCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(pCreatePromptMock).toHaveBeenCalledWith(promptToSave);
   });
});
