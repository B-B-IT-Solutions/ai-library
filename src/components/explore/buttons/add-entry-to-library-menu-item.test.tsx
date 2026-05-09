jest.mock("@/data/actions/catalog");
jest.mock("sonner");

import { MouseEvent } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { Action, ExternalToast, toast } from "sonner";

import { addCatalogEntryToUserTemplates } from "@/data/actions/catalog";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

import { AddCatalogEntryToLibraryMenuItem } from "./add-entry-to-library-menu-item";

const addCatalogEntryMock =
   addCatalogEntryToUserTemplates as jest.MockedFunction<
      typeof addCatalogEntryToUserTemplates
   >;
const toastMock = toast as jest.Mocked<typeof toast>;
const onAuthRequiredMock = jest.fn();

const assertMenuItemRendered = () => {
   const item = screen.getByTestId("add-entry-to-library-menu-item");
   assertInDocument(item);
};

describe("AddCatalogEntryToLibraryMenuItem rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("authenticated - test", async () => {
      const entry = dtestData.dCatalogEntry();
      const { container } = render(
         <AddCatalogEntryToLibraryMenuItem
            entry={entry}
            isAuthenticated={true}
            onAuthRequired={onAuthRequiredMock}
         />
      );

      await waitFor(() => {
         assertMenuItemRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("unauthenticated - test", async () => {
      const entry = dtestData.dCatalogEntry();
      const { container } = render(
         <AddCatalogEntryToLibraryMenuItem
            entry={entry}
            isAuthenticated={false}
            onAuthRequired={onAuthRequiredMock}
         />
      );

      await waitFor(() => {
         assertMenuItemRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddCatalogEntryToLibraryMenuItem functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("unauthenticated - item clicked - calls onAuthRequired - test", async () => {
      const entry = dtestData.dCatalogEntry();
      render(
         <AddCatalogEntryToLibraryMenuItem
            entry={entry}
            isAuthenticated={false}
            onAuthRequired={onAuthRequiredMock}
         />
      );

      await waitFor(() => {
         assertMenuItemRendered();
      });

      const item = screen.getByTestId("add-entry-to-library-menu-item");
      await userEvent.click(item);

      await waitFor(() => {
         expect(onAuthRequiredMock).toHaveBeenCalledTimes(1);
      });
   });

   it("authenticated - item clicked - success - test", async () => {
      const descriptorId = "descriptor-id-1";

      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Erfolgreich copiert",
         data: { templateId: descriptorId },
      };
      addCatalogEntryMock.mockResolvedValue(actionResult);

      const entry = dtestData.dCatalogEntry();
      render(
         <AddCatalogEntryToLibraryMenuItem
            entry={entry}
            isAuthenticated={true}
            onAuthRequired={onAuthRequiredMock}
         />
      );

      await waitFor(() => {
         assertMenuItemRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const item = screen.getByTestId("add-entry-to-library-menu-item");
      await userEvent.click(item);

      await waitFor(() => {
         expect(addCatalogEntryMock).toHaveBeenCalledTimes(1);
         expect(addCatalogEntryMock).toHaveBeenCalledWith(entry.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(
            "Vorlage wurde in deine Library übernommen",
            expect.objectContaining({
               duration: 5000,
               action: expect.objectContaining({ label: "Jetzt anzeigen" }),
            })
         );
      });

      const toastCall = toastMock.success.mock.calls[0];
      const toastOptions = toastCall[1] as ExternalToast;
      const action = toastOptions.action as Action;
      const event = null as unknown as MouseEvent<HTMLButtonElement>;
      action.onClick(event);

      expect(mockRouter.asPath).toEqual(`/templates/${descriptorId}`);
   });

   it("authenticated - item clicked - error - test", async () => {
      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: false,
         message: "Vorlage konnte nicht copiert werden",
      };
      addCatalogEntryMock.mockResolvedValue(actionResult);

      const entry = dtestData.dCatalogEntry();
      render(
         <AddCatalogEntryToLibraryMenuItem
            entry={entry}
            isAuthenticated={true}
            onAuthRequired={onAuthRequiredMock}
         />
      );

      const item = screen.getByTestId("add-entry-to-library-menu-item");
      await userEvent.click(item);

      await waitFor(() => {
         expect(addCatalogEntryMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Vorlage konnte nicht übernommen werden"
         );
      });
   });
});
