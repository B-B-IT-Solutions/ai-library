import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { DeleteDropdownMenuItem } from "./delete-dropdown-menu-item";

const assertRendered = () => {
   const menuItem = screen.getByTestId("delete-dropdown-menu-item");
   assertInDocument(menuItem);
};

const assertDialogOpen = () => {
   const content = screen.getByTestId("delete-dialog-content");
   const header = screen.getByTestId("delete-dialog-header");
   const footer = screen.getByTestId("delete-dialog-footer");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const confirmBtn = screen.getByTestId("confirm-btn");

   assertInDocument(content);
   assertInDocument(header);
   assertInDocument(footer);
   assertInDocument(cancelBtn);
   assertInDocument(confirmBtn);
};

const assertDialogClosed = () => {
   const content = screen.queryByTestId("delete-dialog-content");
   const header = screen.queryByTestId("delete-dialog-header");
   const footer = screen.queryByTestId("delete-dialog-footer");
   const cancelBtn = screen.queryByTestId("cancel-btn");
   const confirmBtn = screen.queryByTestId("confirm-btn");

   assertNotInDocument(content);
   assertNotInDocument(header);
   assertNotInDocument(footer);
   assertNotInDocument(cancelBtn);
   assertNotInDocument(confirmBtn);
};

describe("DeleteDropdownMenuItem rendering tests", () => {
   it("rendered test", async () => {
      const { container } = render(
         <DeleteDropdownMenuItem
            label="Löschen"
            onDelete={jest.fn()}
            dialog={{
               title: "Vorlage löschen?",
               description:
                  "Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage wird dauerhaft gelöscht.",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteDropdownMenuItem functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/prompts/test-id");
   });

   it("confirm btn clicked - onDelete called - test", async () => {
      const onDeleteFn = jest.fn();

      render(
         <DeleteDropdownMenuItem
            label="Löschen"
            onDelete={onDeleteFn}
            dialog={{
               title: "Vorlage löschen?",
               description:
                  "Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage wird dauerhaft gelöscht.",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(onDeleteFn).not.toHaveBeenCalled();
      });

      const deleteMenuItem = screen.getByTestId("delete-dropdown-menu-item");
      await userEvent.click(deleteMenuItem);

      await waitFor(() => {
         assertDialogOpen();
         expect(onDeleteFn).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         assertDialogClosed();
         expect(onDeleteFn).toHaveBeenCalledTimes(1);
      });
   });

   it("cancel btn clicked - onDelete not called - test", async () => {
      const onDeleteFn = jest.fn();

      render(
         <DeleteDropdownMenuItem
            label="Löschen"
            onDelete={onDeleteFn}
            dialog={{
               title: "Vorlage löschen?",
               description:
                  "Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage wird dauerhaft gelöscht.",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(onDeleteFn).not.toHaveBeenCalled();
      });

      const deleteMenuItem = screen.getByTestId("delete-dropdown-menu-item");
      await userEvent.click(deleteMenuItem);

      await waitFor(() => {
         assertDialogOpen();
         expect(onDeleteFn).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         assertDialogClosed();
         expect(onDeleteFn).not.toHaveBeenCalled();
      });
   });
});
