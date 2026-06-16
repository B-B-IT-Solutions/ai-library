import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptSidebarPublic } from "./prompt-sidebar-public";

const assertRendered = () => {
   const sidebar = screen.getByTestId("prompt-sidebar-public");
   const usePromptBtn = screen.getByTestId("public-use-prompt-btn");
   const downloadPromptBtn = screen.getByTestId("download-prompt-btn");

   assertInDocument(sidebar);
   assertInDocument(usePromptBtn);
   assertInDocument(downloadPromptBtn);
};

describe("PromptSidebar rendering tests", () => {
   it("collection undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(<PromptSidebarPublic prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
