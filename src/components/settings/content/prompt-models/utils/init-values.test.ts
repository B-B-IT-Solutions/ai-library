import { dtestData } from "@tests";

import {
   DPromptModelUpdate,
   DPromptModelWithUsage,
} from "@/data/types/domain/prompt";

import { initPromptModel } from "./init-values";

const expectedInitPromptModelExisting = (
   model: DPromptModelWithUsage
): DPromptModelUpdate => {
   return {
      name: model.name,
   };
};

const expectedInitPromptModelNew: DPromptModelUpdate = {
   name: "",
};

describe("initPromptModel tests", () => {
   it("new model test", () => {
      const initValue = initPromptModel();
      expect(initValue).toEqual(expectedInitPromptModelNew);
   });

   it("existing model test", () => {
      const model = dtestData.dPromptModelWithUsage();
      const initValues = initPromptModel(model);
      const expectedValues = expectedInitPromptModelExisting(model);
      expect(initValues).toEqual(expectedValues);
   });
});
