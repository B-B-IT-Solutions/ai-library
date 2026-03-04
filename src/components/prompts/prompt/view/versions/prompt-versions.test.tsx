import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { PromptVersions } from "./prompt-versions";

const assertRendered = () => {
   const versions = screen.getByTestId("prompt-versions");
   const expandBtn = screen.getByTestId("expand-btn");

   assertInDocument(versions);
   assertInDocument(expandBtn);
};

const assertNotRendered = () => {
   const versions = screen.queryByTestId("prompt-versions");
   assertNotInDocument(versions);
};

const assertExpanded = () => {
   const chevron = screen.getByTestId("chevron-down");
   assertInDocument(chevron);
};

const assertNotExpanded = () => {
   const chevron = screen.getByTestId("chevron-left");
   assertInDocument(chevron);
};

describe("PromptVersion rendering tests", () => {
   it("PromptVersion rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const { container } = render(<PromptVersions prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptVersion not rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      prompt.versions = [];

      const { container } = render(<PromptVersions prompt={prompt} />);

      await waitFor(() => {
         assertNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptVersion functionality tests", () => {
   it("PromptVersion - expand btn clicked - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      render(<PromptVersions prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
      });

      const expandBtn = screen.getByTestId("expand-btn");
      userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
      });
   });
});
