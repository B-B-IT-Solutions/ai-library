jest.mock("@/data/actions/library");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deleteLibraryEntry } from "@/data/actions/library";

import { DeleteLibraryEntryButton } from "./delete-library-entry-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const deleteLibraryEntryMock = deleteLibraryEntry as jest.MockedFunction<
   typeof deleteLibraryEntry
>;

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-entry-menu-item");
   assertInDocument(deleteBtn);
};

describe("DeleteLibraryEntryButton rendering tests", () => {
   it("rendered test", async () => {
      const entry = dtestData.dLibraryEntry();
      const { container } = render(<DeleteLibraryEntryButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteLibraryEntryButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/library/test-id");
   });

   it("confirm btn clicked - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt deleted",
      };
      deleteLibraryEntryMock.mockResolvedValue(actionResult);

      const entry = dtestData.dLibraryEntry();
      render(<DeleteLibraryEntryButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteLibraryEntryMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-entry-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteLibraryEntryMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(deleteLibraryEntryMock).toHaveBeenCalledWith(entry.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/library");
      });
   });

   it("confirm btn clicked - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "Prompt couldn't be deleted",
      };
      deleteLibraryEntryMock.mockResolvedValue(actionResult);

      const entry = dtestData.dLibraryEntry();
      render(<DeleteLibraryEntryButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteLibraryEntryMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-entry-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteLibraryEntryMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(deleteLibraryEntryMock).toHaveBeenCalledWith(entry.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/library/test-id");
      });
   });

   it("cancel btn clicked - delete not called - test", async () => {
      const entry = dtestData.dLibraryEntry();
      render(<DeleteLibraryEntryButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteLibraryEntryMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-entry-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteLibraryEntryMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deleteLibraryEntryMock).not.toHaveBeenCalled();
         expect(mockRouter.pathname).toEqual("/library/test-id");
      });
   });
});
