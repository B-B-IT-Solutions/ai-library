jest.mock("@/data/db/queries/prompt");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   createPrompt as pCreatePrompt,
   getPrompt as pGetPrompt,
   getPromptCategories as pGetPromptCategories,
   getPrompts as pGetPrompts,
} from "@/data/db/queries/prompt";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import {
   createPrompt,
   getPrompt,
   getPromptCategories,
   getPrompts,
} from "./prompt.actions";
import { toDPrompt, toDPromptsPage } from "./prompt.mapper";

const pGetPromptsMock = pGetPrompts as jest.MockedFunction<typeof pGetPrompts>;
const pGetPromptMock = pGetPrompt as jest.MockedFunction<typeof pGetPrompt>;
const pGetPromptCategoriesMock = pGetPromptCategories as jest.MockedFunction<
   typeof pGetPromptCategories
>;
const pCreatePromptMock = pCreatePrompt as jest.MockedFunction<
   typeof pCreatePrompt
>;

describe("getPromptss tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPrompts - query undefined - test", async () => {
      const page = ptestData.pPromptsPage();
      pGetPromptsMock.mockResolvedValue(page);

      const result = await getPrompts();
      const expectedResult = toDPromptsPage(page);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptsMock).toHaveBeenCalledWith(undefined);
   });

   it("getPrompts - query empty - test", async () => {
      const page = ptestData.pPromptsPage();
      pGetPromptsMock.mockResolvedValue(page);

      const query: DPromptsPageQuery = {};
      const result = await getPrompts(query);
      const expectedResult = toDPromptsPage(page);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptsMock).toHaveBeenCalledWith(query);
   });

   it("getPrompts - query defined - test", async () => {
      const page = ptestData.pPromptsPage();
      pGetPromptsMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();
      const result = await getPrompts(query);
      const expectedResult = toDPromptsPage(page);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptsMock).toHaveBeenCalledWith(query);
   });
});

describe("getPromptCategories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptCategories test", async () => {
      const categories = ptestData.pPromptCategories();
      pGetPromptCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptCategories();
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptCategoriesMock).toHaveBeenCalledTimes(1);
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPrompt  - promt undefined - test", async () => {
      pGetPromptMock.mockResolvedValue(null);

      const id = "product-1";
      const result = await getPrompt(id);

      expect(result).toBeUndefined();
      expect(pGetPromptMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptMock).toHaveBeenCalledWith({ id });
   });

   it("getPrompt  - product defined - test", async () => {
      const prompt = ptestData.pPromptWithCategories();
      pGetPromptMock.mockResolvedValue(prompt);

      const id = "product-1";
      const result = await getPrompt(id);
      const expectedResult = toDPrompt(prompt);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptMock).toHaveBeenCalledWith({ id });
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createPrompt - error - test", async () => {
      const prompt = dtestData.dPrompt();
      pCreatePromptMock.mockRejectedValue(new Error("db error"));

      const result = await createPrompt(prompt);
      const expectedResult = {
         success: false,
         message: "db error",
      };
      const promptToSave = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
         followUpPrompts: prompt.followUpPrompts,
         currentVersion: 1,
         categories: {
            connectOrCreate: [
               {
                  where: {
                     name: "category 1",
                  },
                  create: {
                     name: "category 1",
                  },
               },
            ],
         },
      };

      expect(result).toEqual(expectedResult);
      expect(pCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(pCreatePromptMock).toHaveBeenCalledWith(promptToSave);
   });

   it("createPrompt - prompt created  - test", async () => {
      const prompt = dtestData.dPrompt();

      const result = await createPrompt(prompt);
      const expectedResult = {
         success: true,
         message: "Prompt created sucessfully.",
      };
      const promptToSave = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
         followUpPrompts: prompt.followUpPrompts,
         currentVersion: 1,
         categories: {
            connectOrCreate: [
               {
                  where: {
                     name: "category 1",
                  },
                  create: {
                     name: "category 1",
                  },
               },
            ],
         },
      };

      expect(result).toEqual(expectedResult);
      expect(pCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(pCreatePromptMock).toHaveBeenCalledWith(promptToSave);
   });
});
