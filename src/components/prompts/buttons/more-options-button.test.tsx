import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { MoreOptionsButton } from "./more-options-button";

const assertRendered = () => {
   const btn = screen.getByTestId("more-options-btn");
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(btn);
   assertInDocument(triggerBtn);
};

const assertContextMenuRendered = () => {
   const downloadBtn = screen.getByTestId("download-prompt-menu-item");
   const deleteBtn = screen.getByTestId("delete-prompt-menu-item");

   assertInDocument(downloadBtn);
   assertInDocument(deleteBtn);
};

const assertContextMenuNotRendered = () => {
   const downloadBtn = screen.queryByTestId("download-prompt-menu-item");
   const deleteBtn = screen.queryByTestId("delete-prompt-menu-item");

   assertNotInDocument(downloadBtn);
   assertNotInDocument(deleteBtn);
};

describe("MoreOptionsButton rendering tests", () => {
   it("rendered test", async () => {
      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <MoreOptionsButton descriptor={descriptor} />
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
      const descriptor = dtestData.dPrompt();
      render(<MoreOptionsButton descriptor={descriptor} />);

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
