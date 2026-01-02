jest.mock("@/data/services/prompt");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { PromptService } from "@/data/services/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";

import {
   createPrompt,
   getPrompt,
   getPromptCategories,
   getPrompts,
} from "./prompt.actions";
import { toDPrompt, toDPromptsPage } from "./prompt.mapper";

const sGetPrompts = PromptService.prototype.getPrompts;
const sGetPrompt = PromptService.prototype.getPrompt;
const sGetPromptCategories = PromptService.prototype.getPromptCategories;
const sCreatePrompt = PromptService.prototype.createPrompt;

const sGetPromptsMock = sGetPrompts as jest.MockedFunction<typeof sGetPrompts>;
const sGetPromptMock = sGetPrompt as jest.MockedFunction<typeof sGetPrompt>;
const sGetPromptCategoriesMock = sGetPromptCategories as jest.MockedFunction<
   typeof sGetPromptCategories
>;
const sCreatePromptMock = sCreatePrompt as jest.MockedFunction<
   typeof sCreatePrompt
>;

describe("getPromptss tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPrompts - query undefined - test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const result = await getPrompts();
      const expectedResult = toDPromptsPage(page);

      expect(result).toEqual(expectedResult);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(undefined);
   });

   it("getPrompts - query empty - test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query: DPromptDescriptorsPageQuery = {};
      const result = await getPrompts(query);
      const expectedResult = toDPromptsPage(page);

      expect(result).toEqual(expectedResult);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(query);
   });

   it("getPrompts - query defined - test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();
      const result = await getPrompts(query);
      const expectedResult = toDPromptsPage(page);

      expect(result).toEqual(expectedResult);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(query);
   });
});

describe("getPromptCategories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptCategories test", async () => {
      const categories = ptestData.pPromptCategories();
      sGetPromptCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptCategories();
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledTimes(1);
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPrompt  - id invalid - test", async () => {
      sGetPromptMock.mockResolvedValue(null);

      const id = "new";
      const result = await getPrompt(id);

      expect(result).toBeUndefined();
      expect(sGetPromptMock).not.toHaveBeenCalled();
   });

   it("getPrompt  - promt undefined - test", async () => {
      sGetPromptMock.mockResolvedValue(null);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(id);

      expect(result).toBeUndefined();
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith({ id });
   });

   it("getPrompt  - product defined - test", async () => {
      const prompt = ptestData.pPromptDescriptorWithCategories();
      sGetPromptMock.mockResolvedValue(prompt);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(id);
      const expectedResult = toDPrompt(prompt);

      expect(result).toEqual(expectedResult);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith({ id });
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createPrompt - error - test", async () => {
      const prompt = dtestData.dPromptCreate();
      sCreatePromptMock.mockRejectedValue(new Error("db error"));

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
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(promptToSave);
   });

   it("createPrompt - prompt created  - test", async () => {
      const prompt = dtestData.dPromptCreate();

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
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(promptToSave);
   });
});
