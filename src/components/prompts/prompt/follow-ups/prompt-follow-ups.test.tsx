import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptFollowUps } from "./prompt-follow-ups";

const assertRendered = () => {
   const followUps = screen.getByTestId("prompt-follow-ups");
   const expandBtn = screen.getByTestId("expand-btn");

   assertInDocument(followUps);
   assertInDocument(expandBtn);
};

const assertNotRendered = () => {
   const followUps = screen.queryByTestId("prompt-follow-ups");
   assertNotInDocument(followUps);
};

const assertExpanded = () => {
   const chevron = screen.getByTestId("chevron-down");
   assertInDocument(chevron);
};

const assertNotExpanded = () => {
   const chevron = screen.getByTestId("chevron-left");
   assertInDocument(chevron);
};

const assertBadge = (prompt: DPromptDescriptor) => {
   const badge = screen.getByText(prompt.followUpPrompts.length.toString());
   assertInDocument(badge);
};

const assertFollowUpItems = (prompt: DPromptDescriptor) => {
   const followUpItems = screen.getAllByTestId("prompt-follow-up");
   expect(followUpItems).toHaveLength(prompt.followUpPrompts.length);
};

describe("PromptFollowUps rendering tests", () => {
   it("PromptFollowUps rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const { container } = render(<PromptFollowUps prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
         assertBadge(prompt);
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptFollowUps not rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      prompt.followUpPrompts = [];

      const { container } = render(<PromptFollowUps prompt={prompt} />);

      await waitFor(() => {
         assertNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFollowUps functionality tests", () => {
   it("PromptFollowUps - expand btn clicked - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      render(<PromptFollowUps prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
      });

      const expandBtn = screen.getByTestId("expand-btn");
      userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
         assertFollowUpItems(prompt);
      });
   });
});
