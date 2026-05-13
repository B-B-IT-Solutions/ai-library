import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithTooltip } from "@tests";

import { CopyPromptButton } from "./copy-prompt-button";

const assertRendered = () => {
   const copyBtn = screen.getByTestId("copy-prompt-btn");
   assertInDocument(copyBtn);
};

const assertCopyIcon = () => {
   const copy = screen.getByTestId("copy-icon");
   assertInDocument(copy);
};

describe("CopyPromptButton rendering tests", () => {
   it("CopyPromptButton rendered", async () => {
      const prompt = dtestData.dPrompt0();
      const { container } = renderWithTooltip(
         <CopyPromptButton prompt={prompt} size="icon-sm" />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });

   it("CopyPromptButton rendered", async () => {
      const prompt = dtestData.dPrompt0();
      const { container } = renderWithTooltip(
         <CopyPromptButton prompt={prompt} size="sm" showLabel={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });
});
