import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptSidebar } from "./prompt-sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("prompt-sidebar");
   const usePromptBtn = screen.getByTestId("use-prompt-btn");
   const editPromptBtn = screen.getByTestId("edit-prompt-btn");
   const downloadPromptBtn = screen.getByTestId("download-prompt-btn");
   const deletePromptBtn = screen.getByTestId("delete-prompt-btn");

   assertInDocument(sidebar);
   assertInDocument(usePromptBtn);
   assertInDocument(editPromptBtn);
   assertInDocument(downloadPromptBtn);
   assertInDocument(deletePromptBtn);
};

describe("PromptSidebar rendering tests", () => {
   it("collection undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(<PromptSidebar prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const collection = dtestData.dCollectionPreview();

      const { container } = render(
         <PromptSidebar prompt={prompt} currentCollection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
