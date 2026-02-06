jest.mock("@/data/actions/prompt");
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

import {
   getPromptCategories,
   getPrompts,
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/data/actions/prompt";
import {
   preloadPromptCategoriesOptions,
   preloadPromptsOptions,
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
} from "@/data/ts-queries/prompt";

import PromptsLayout from "./layout";

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

const assertRendered = () => {
   const layout = screen.getByTestId("prompts-layout");
   const list = screen.getByTestId("prompts-list");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(list);
   assertInDocument(test1);
};

describe("PromptsLayout rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("PromptsLayout rendered test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      const templates = dtestData.dPromptTemplateDescriptors();
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

      const { container } = await renderAsyncRSC(PromptsLayout, {
         children: <div data-testid="test-1"></div>,
      });

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
