jest.mock("@/data/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getPrompts } from "@/data/actions/prompt/prompt.actions";

import PromptsPage, { metadata } from "./page";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

export const expectedMetadata: Metadata = {
   title: "Prompts",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompts-page");
   const promptManager = screen.getByTestId("prompt-manager");

   assertInDocument(page);
   assertInDocument(promptManager);
};

// describe("PromptsPage rendering tests", () => {
//    beforeEach(() => {
//       jest.resetAllMocks();
//    });

//    it("PromptsPage - prompts retrieved - rendered test", async () => {
//       const prompts = dtestData.dPrompts();
//       getPromptsMock.mockResolvedValue(prompts);

//       const { container } = await renderAsyncRSC(PromptsPage, {});

//       await waitFor(() => {
//          assertRendered();
//       });

//       expect(container).toMatchSnapshot();
//    });
// });

describe("PromptsPage functionality tests", () => {
   it("PromptsPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
