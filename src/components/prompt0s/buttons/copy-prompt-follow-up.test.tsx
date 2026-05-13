import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithTooltip } from "@tests";

import { CopyPromptFollowUpButton } from "./copy-prompt-follow-up";

const assertRendered = () => {
   const copyBtn = screen.getByTestId("copy-prompt-follow-up-btn");
   assertInDocument(copyBtn);
};

const assertCopyIcon = () => {
   const copy = screen.getByTestId("copy-icon");
   assertInDocument(copy);
};

describe("CopyPromptFollowUpButton rendering tests", () => {
   it("CopyPromptFollowUpButton rendered", async () => {
      const followUp = dtestData.dPromptFollowUp();

      const { container } = renderWithTooltip(
         <CopyPromptFollowUpButton followUp={followUp} />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });
});
