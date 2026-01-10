import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { PromptFollowUp } from "./prompt-follow-up";

const assertRendered = () => {
   const followUp = screen.getByTestId("prompt-follow-up");
   assertInDocument(followUp);
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

   it("PromptFollowUp displays content", async () => {
      const followUp = dtestData.dPromptFollowUp();

      render(<PromptFollowUp followUp={followUp} />);

      await waitFor(() => {
         const content = screen.getByText(followUp.content);
         assertInDocument(content);
      });
   });
});

describe("PromptFollowUp functionality tests", () => {
   it("PromptFollowUp - copy button shows check icon after click", async () => {
      const followUp = dtestData.dPromptFollowUp();

      // Mock clipboard API
      Object.assign(navigator, {
         clipboard: {
            writeText: jest.fn(() => Promise.resolve()),
         },
      });

      render(<PromptFollowUp followUp={followUp} />);

      await waitFor(() => {
         assertRendered();
      });

      const copyButton = screen.getByTitle("Copy to clipboard");
      userEvent.click(copyButton);

      await waitFor(() => {
         expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            followUp.content
         );
      });
   });
});
