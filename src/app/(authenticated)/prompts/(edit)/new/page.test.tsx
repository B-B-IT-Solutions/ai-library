import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import CreatePromptPage, { metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Create Prompt",
};

const assertRendered = () => {
   const page = screen.getByTestId("create-prompt-page");
   const promptCreateEdit = screen.getByTestId("prompt-create-edit");

   assertInDocument(page);
   assertInDocument(promptCreateEdit);
};

describe("CreatePromptPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptPage - prompt found -rendered test", async () => {
      const { container } = await renderAsyncRSC(CreatePromptPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptPage functionality tests", () => {
   it("CreatePromptPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
