import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptViewSidebar } from "./prompt-view-sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("prompt-view-sidebar");
   const usePromptBtn = screen.getByTestId("use-prompt-btn");
   const editPromptBtn = screen.getByTestId("edit-template-btn");
   const downloadPromptBtn = screen.getByTestId("download-template-btn");
   const deletePromptBtn = screen.getByTestId("delete-template-btn");

   assertInDocument(sidebar);
   assertInDocument(usePromptBtn);
   assertInDocument(editPromptBtn);
   assertInDocument(downloadPromptBtn);
   assertInDocument(deletePromptBtn);
};

describe("PromptViewSidebar rendering tests", () => {
   it("rendered - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(<PromptViewSidebar prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
