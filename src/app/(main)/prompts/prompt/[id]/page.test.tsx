import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import PromptPage, { metadata } from "./page";

export const expectedMetadata: Metadata = {
   title: "Prompt",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompt-page");

   assertInDocument(page);
};

describe("PromptPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptPage rendered test", async () => {
      const { container } = await renderAsyncRSC(PromptPage);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptPage functionality tests", () => {
   it("PromptPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
