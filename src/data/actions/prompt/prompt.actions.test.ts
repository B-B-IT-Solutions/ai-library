jest.mock("@/data/services/prompt");

import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import { PromptService } from "@/data/services/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";

import {
   createPrompt,
   getPrompt,
   getPromptCategories,
   getPrompts,
} from "./prompt.actions";

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
      const page = dtestData.dPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const result = await getPrompts();

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(undefined);
   });

   it("getPrompts - query empty - test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query: DPromptDescriptorsPageQuery = {};
      const result = await getPrompts(query);

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(query);
   });

   it("getPrompts - query defined - test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();
      const result = await getPrompts(query);

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(query);
   });
});

describe("getPromptCategories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptCategories test", async () => {
      const categories = dtestData.dPromptCategories();
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

   it("getPrompt  - promt undefined - test", async () => {
      sGetPromptMock.mockResolvedValue(undefined);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(id);

      expect(result).toBeUndefined();
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(id);
   });

   it("getPrompt  - product defined - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      sGetPromptMock.mockResolvedValue(prompt);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(id);

      expect(result).toEqual(prompt);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(id);
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createPrompt - error - test", async () => {
      const prompt = dtestData.dPromptUpdate();
      sCreatePromptMock.mockRejectedValue(new Error("db error"));

      const result = await createPrompt(prompt);
      const expectedResult = {
         success: false,
         message: "db error",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(prompt);
   });

   it("createPrompt - prompt created  - test", async () => {
      const prompt = dtestData.dPromptUpdate();

      const result = await createPrompt(prompt);
      const expectedResult = {
         success: true,
         message: "Prompt erfolgreich erstellt.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(prompt);
   });
});
