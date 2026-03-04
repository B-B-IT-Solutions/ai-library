import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { metadata, NewPromptPage } from "./page";

const expectedMetadata: Metadata = {
   title: "Create Prompt",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompt-new-page");
   const promptCreateEdit = screen.getByTestId("prompt-edit");

   assertInDocument(page);
   assertInDocument(promptCreateEdit);
};

describe("NewPromptPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("NewPromptPage - prompt found -rendered test", async () => {
      const { container } = await renderAsyncRSC(NewPromptPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("NewPromptPage functionality tests", () => {
   it("NewPromptPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
