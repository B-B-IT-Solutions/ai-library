jest.mock("@/data/actions/catalog");
jest.mock("sonner");

import { MouseEvent } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { Action, ExternalToast, toast } from "sonner";

import { addCatalogEntryToUserTemplates } from "@/data/actions/catalog";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

import { AddCatalogEntryToLibraryButton } from "./add-entry-to-library-button";

const addEntryToUserTemplatesMock =
   addCatalogEntryToUserTemplates as jest.MockedFunction<
      typeof addCatalogEntryToUserTemplates
   >;
const toastMock = toast as jest.Mocked<typeof toast>;

const assertRendered = () => {
   const btn = screen.getByTestId("add-entry-to-library-btn");
   assertInDocument(btn);
};

const assertAuthDialogRendered = () => {
   const dialog = screen.getByTestId("auth-required-dialog");
   assertInDocument(dialog);
};

const assertAuthDialogNotRendered = () => {
   const dialog = screen.queryByTestId("auth-required-dialog");
   assertNotInDocument(dialog);
};

describe("AddCatalogEntryToLibraryButton rendering tests", () => {
   it("isAuthenticated true - test", async () => {
      const entry = dtestData.dCatalogEntry();
      const { container } = render(
         <AddCatalogEntryToLibraryButton entry={entry} isAuthenticated={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated false - test", async () => {
      const entry = dtestData.dCatalogEntry();

      const { container } = render(
         <AddCatalogEntryToLibraryButton
            entry={entry}
            isAuthenticated={false}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddCatalogEntryToLibraryButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("unauthenticated - btn clicked - test", async () => {
      const entry = dtestData.dCatalogEntry();
      render(
         <AddCatalogEntryToLibraryButton
            entry={entry}
            isAuthenticated={false}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertAuthDialogNotRendered();
      });

      const btn = screen.getByTestId("add-entry-to-library-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertAuthDialogRendered();
      });
   });

   it("authenticated - btn clicked - success - test", async () => {
      const descriptorId = "descriptor-id-1";

      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Erfolgreich copiert",
         data: {
            templateId: descriptorId,
         },
      };
      addEntryToUserTemplatesMock.mockResolvedValue(actionResult);

      const entry = dtestData.dCatalogEntry();
      render(
         <AddCatalogEntryToLibraryButton entry={entry} isAuthenticated={true} />
      );

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("add-entry-to-library-btn");
      await userEvent.click(btn);

      const expectedToastPayload = {
         action: {
            label: "Jetzt anzeigen",
            onClick: expect.any(Function),
         },
         duration: 5000,
      };

      await waitFor(() => {
         expect(addEntryToUserTemplatesMock).toHaveBeenCalledTimes(1);
         expect(addEntryToUserTemplatesMock).toHaveBeenCalledWith(entry.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(
            "Vorlage wurde in deine Library übernommen",
            expectedToastPayload
         );
      });

      const toastCall = toastMock.success.mock.calls[0];
      const toastOptions = toastCall[1] as ExternalToast;
      const action = toastOptions.action as Action;
      const event = null as unknown as MouseEvent<HTMLButtonElement>;
      action.onClick(event);

      expect(mockRouter.asPath).toEqual(`/templates/${descriptorId}`);
   });

   it("authenticated - btn clicked - error - test", async () => {
      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: false,
         message: "Vorlage konnte nicht copiert werden",
      };
      addEntryToUserTemplatesMock.mockResolvedValue(actionResult);

      const entry = dtestData.dCatalogEntry();
      render(
         <AddCatalogEntryToLibraryButton entry={entry} isAuthenticated={true} />
      );

      const btn = screen.getByTestId("add-entry-to-library-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(addEntryToUserTemplatesMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Vorlage konnte nicht übernommen werden"
         );
      });
   });
});
