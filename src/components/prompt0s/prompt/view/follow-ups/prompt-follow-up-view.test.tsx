import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptFollowUp } from "./prompt-follow-up-view";

const assertRendered = () => {
   const followUp = screen.getByTestId("prompt-follow-up");
   const copyBtn = screen.getByTestId("copy-prompt-follow-up-btn");

   assertInDocument(followUp);
   assertInDocument(copyBtn);
};

describe("PromptFollowUp rendering tests", () => {
   it("PromptFollowUp rendered test", async () => {
      const followUp = dtestData.dPromptFollowUp();

      const { container } = render(<PromptFollowUp followUp={followUp} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
