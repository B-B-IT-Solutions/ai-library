jest.mock("@/data/actions/prompt/prompt.actions");
jest.mock("@/data/actions/prompt/prompt.template.actions");
jest.mock("@/data/ts-queries/prompt", () => ({
   ...jest.requireActual("@/data/ts-queries/prompt"),
   preloadPromptsOptions: jest.fn(),
   preloadPromptCategoriesOptions: jest.fn(),
   preloadPromptTemplatesOptions: jest.fn(),
   preloadPromptTemplateCategoriesOptions: jest.fn(),
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import MockDate from "mockdate";
import { Metadata } from "next";

import {
   getPromptCategories,
   getPrompts,
} from "@/data/actions/prompt/prompt.actions";
import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/data/actions/prompt/prompt.template.actions";
import {
   preloadPromptCategoriesOptions,
   preloadPromptsOptions,
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
} from "@/data/ts-queries/prompt";

import PromptsPage, { metadata } from "./page";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;
const preloadPromptCategoriesOptionsMock =
   preloadPromptCategoriesOptions as jest.MockedFunction<
      typeof preloadPromptCategoriesOptions
   >;
const getPromptCategoriesMock = getPromptCategories as jest.MockedFunction<
   typeof getPromptCategories
>;

const getPromptTemplatesMock = getPromptTemplates as jest.MockedFunction<
   typeof getPromptTemplates
>;
const getPromptTemplateCategoriesMock =
   getPromptTemplateCategories as jest.MockedFunction<
      typeof getPromptTemplateCategories
   >;

const preloadPromptsOptionsMock = preloadPromptsOptions as jest.MockedFunction<
   typeof preloadPromptsOptions
>;

const preloadPromptTemplatesOptionsMock =
   preloadPromptTemplatesOptions as jest.MockedFunction<
      typeof preloadPromptTemplatesOptions
   >;
const preloadPromptTemplateCategoriesOptionsMock =
   preloadPromptTemplateCategoriesOptions as jest.MockedFunction<
      typeof preloadPromptTemplateCategoriesOptions
   >;

export const expectedMetadata: Metadata = {
   title: "Prompts",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompts-page");
   const list = screen.getByTestId("prompts-list");
   const promptView = screen.getByTestId("prompt-view");

   assertInDocument(page);
   assertInDocument(list);
   assertInDocument(promptView);
};

describe("PromptsPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("PromptsPage - prompts retrieved - rendered test", async () => {
      const page = dtestData.dPromptsPage();
      const templates = dtestData.dPromptTemplates();
      const promptCategories = ["category 1", "category 2", "category 789"];
      const templateCategories = ["category 1", "category 2", "category 3"];

      getPromptsMock.mockResolvedValue(page);
      getPromptCategoriesMock.mockResolvedValue(promptCategories);
      getPromptTemplatesMock.mockResolvedValue(templates);
      getPromptTemplateCategoriesMock.mockResolvedValue(templateCategories);
      preloadPromptsOptionsMock.mockReturnValue({ queryKey: ["prompts"] });
      preloadPromptCategoriesOptionsMock.mockReturnValue({
         queryKey: ["prompt-categories"],
      });
      preloadPromptTemplatesOptionsMock.mockReturnValue({
         queryKey: ["prompts-templates"],
      });
      preloadPromptTemplateCategoriesOptionsMock.mockReturnValue({
         queryKey: ["prompts-template-categories"],
      });

      const { container } = await renderAsyncRSC(PromptsPage);

      await waitFor(() => {
         assertRendered();
      });

      expect(preloadPromptsOptionsMock).toHaveBeenCalledTimes(1);
      expect(preloadPromptTemplatesOptionsMock).toHaveBeenCalledTimes(1);
      expect(preloadPromptTemplateCategoriesOptionsMock).toHaveBeenCalledTimes(
         1
      );
      expect(getPromptsMock).toHaveBeenCalledTimes(1);

      expect(container).toMatchSnapshot();
   });
});

describe("PromptsPage functionality tests", () => {
   it("PromptsPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
