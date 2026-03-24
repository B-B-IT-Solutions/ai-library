import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithTooltip,
} from "@tests";

import { MoreOptionsButton } from "./more-options-button";

const assertRendered = () => {
   const btn = screen.getByTestId("more-options-btn");
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(btn);
   assertInDocument(triggerBtn);
};

const assertContextMenuRendered = () => {
   const deleteBtn = screen.getByTestId("delete-prompt-btn");
   assertInDocument(deleteBtn);
};

const assertContextMenuNotRendered = () => {
   const deleteBtn = screen.queryByTestId("delete-prompt-btn");
   assertNotInDocument(deleteBtn);
};

describe("MoreOptionsButton rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = renderWithTooltip(
         <MoreOptionsButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MoreOptionsButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("trigger clicked - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<MoreOptionsButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
      });
   });
});
