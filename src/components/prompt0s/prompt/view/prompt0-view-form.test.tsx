import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { Prompt0ViewForm } from "./prompt0-view-form";

const assertRendered = () => {
   const form = screen.getByTestId("prompt-view-form");
   assertInDocument(form);
};

const assertActionsRendered = () => {
   const toggleBtn = screen.getByTestId("toggle-favorite-btn");
   const editBtn = screen.getByTestId("edit-prompt-btn");
   const moreOptionsBtn = screen.getByTestId("more-options-btn");

   assertInDocument(toggleBtn);
   assertInDocument(editBtn);
   assertInDocument(moreOptionsBtn);
};

const assertVersionsRendered = () => {
   const versions = screen.getByTestId("prompt-versions");
   assertInDocument(versions);
};

const assertVersionsNotRendered = () => {
   const versions = screen.queryByTestId("prompt-versions");
   assertNotInDocument(versions);
};

const assertFollowUpsRendered = () => {
   const followUps = screen.getByTestId("prompt-follow-ups");
   assertInDocument(followUps);
};

const assertFollowUpsNotRendered = () => {
   const followUps = screen.queryByTestId("prompt-follow-ups");
   assertNotInDocument(followUps);
};

describe("Prompt0ViewForm rendering tests", () => {
   it("rendered - test", async () => {
      const prompt = dtestData.dPrompt0();
      const { container } = render(<Prompt0ViewForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertActionsRendered();
         assertVersionsRendered();
         assertFollowUpsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("versions empty - rendered test", async () => {
      const prompt = dtestData.dPrompt0();
      prompt.versions = [];
      const { container } = render(<Prompt0ViewForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertActionsRendered();
         assertVersionsNotRendered();
         assertFollowUpsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("followUpPrompts empty - rendered test", async () => {
      const prompt = dtestData.dPrompt0();
      prompt.followUpPrompts = [];
      prompt.categories = [];
      const { container } = render(<Prompt0ViewForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertActionsRendered();
         assertVersionsRendered();
         assertFollowUpsNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
