import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptSidebar } from "./prompt-sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("prompt-sidebar");
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

describe("PromptSidebar rendering tests", () => {
   it("rendered - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(<PromptSidebar prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
