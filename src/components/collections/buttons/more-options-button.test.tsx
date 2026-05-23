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
   const editBtn = screen.getByTestId("edit-collection-menu-item");
   const deleteBtn = screen.getByTestId("delete-collection-menu-item");

   assertInDocument(editBtn);
   assertInDocument(deleteBtn);
};

const assertContextMenuNotRendered = () => {
   const editBtn = screen.queryByTestId("edit-template-menu-item");
   const deleteBtn = screen.queryByTestId("delete-prompt-menu-item");

   assertNotInDocument(editBtn);
   assertNotInDocument(deleteBtn);
};

describe("MoreOptionsButton rendering tests", () => {
   it("size - default test", async () => {
      const collection = dtestData.dCollection();
      const { container } = render(
         <MoreOptionsButton collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("size - icon-sm - test", async () => {
      const collection = dtestData.dCollection();
      const { container } = render(
         <MoreOptionsButton collection={collection} size="icon-sm" />
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
      const collection = dtestData.dCollection();
      render(<MoreOptionsButton collection={collection} />);

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
