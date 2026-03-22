import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { PromptViewForm } from "./prompt-view-form";

const assertRendered = () => {
   const form = screen.getByTestId("prompt-view-form");
   assertInDocument(form);
};

const assertActionsRendered = () => {
   const toggleBtn = screen.getByTestId("toggle-favorite-btn");
   const editBtn = screen.getByTestId("edit-prompt-btn");
   const actionsContextMenu = screen.getByTestId("actions-context-menu");

   assertInDocument(toggleBtn);
   assertInDocument(editBtn);
   assertInDocument(actionsContextMenu);
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

describe("PromptViewForm rendering tests", () => {
   it("rendered - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = render(<PromptViewForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertActionsRendered();
         assertVersionsRendered();
         assertFollowUpsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("versions empty - rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      prompt.versions = [];
      const { container } = render(<PromptViewForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertActionsRendered();
         assertVersionsNotRendered();
         assertFollowUpsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("followUpPrompts empty - rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      prompt.followUpPrompts = [];
      prompt.categories = [];
      const { container } = render(<PromptViewForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertActionsRendered();
         assertVersionsRendered();
         assertFollowUpsNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
