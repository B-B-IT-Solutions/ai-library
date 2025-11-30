jest.mock("@/data/actions/prompt/prompt.actions");
jest.mock("@/data/actions/prompt/prompt.template.actions");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import MockDate from "mockdate";
import { Metadata } from "next";

import { getPrompts } from "@/data/actions/prompt/prompt.actions";
import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/data/actions/prompt/prompt.template.actions";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import PromptsPage, { metadata } from "./page";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

const getPromptTemplatesMock = getPromptTemplates as jest.MockedFunction<
   typeof getPromptTemplates
>;

const getPromptTemplateCategoriesMock =
   getPromptTemplateCategories as jest.MockedFunction<
      typeof getPromptTemplateCategories
   >;

export const expectedMetadata: Metadata = {
   title: "Prompts",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompts-page");
   const promptManager = screen.getByTestId("prompt-manager");

   assertInDocument(page);
   assertInDocument(promptManager);
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
      const categories = ["category 1", "category 2", "category 3"];

      getPromptsMock.mockResolvedValue(page);
      getPromptTemplatesMock.mockResolvedValue(templates);
      getPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const { container } = await renderAsyncRSC(PromptsPage, {});

      await waitFor(() => {
         assertRendered();
      });

      const expectedQuery: DPromptsPageQuery = {
         pagination: { pageNumber: 1, pageSize: 10 },
      };
      expect(getPromptsMock).toHaveBeenCalledTimes(1);
      expect(getPromptsMock).toHaveBeenCalledWith(expectedQuery);

      expect(container).toMatchSnapshot();
   });
});

describe("PromptsPage functionality tests", () => {
   it("PromptsPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
