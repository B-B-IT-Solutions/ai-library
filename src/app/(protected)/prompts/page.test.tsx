import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import PromptsPage, { metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Prompts",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompts-page");
   const promptView = screen.getByTestId("prompt-view");

   assertInDocument(page);
   assertInDocument(promptView);
};

describe("PromptsPage rendering tests", () => {
   it("PromptsPage - prompts retrieved - rendered test", async () => {
      const { container } = await renderAsyncRSC(PromptsPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptsPage functionality tests", () => {
   it("PromptsPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
