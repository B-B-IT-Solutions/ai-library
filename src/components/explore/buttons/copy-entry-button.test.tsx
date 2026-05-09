jest.mock("@/data/actions/catalog");
jest.mock("sonner");

import { MouseEvent } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { Action, ExternalToast, toast } from "sonner";

import { copyCatalogEntryToUserTemplates } from "@/data/actions/catalog";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

import { CopyCatalogEntryButton } from "./copy-entry-button";

const copyCatalogEntryMock =
   copyCatalogEntryToUserTemplates as jest.MockedFunction<
      typeof copyCatalogEntryToUserTemplates
   >;
const toastMock = toast as jest.Mocked<typeof toast>;

const assertAuthenticatedBtnRendered = () => {
   const btn = screen.getByTestId("catalog-entry-copy-btn");
   assertInDocument(btn);
};

const assertNotAuthenticatedBtnRendered = () => {
   const btn = screen.getByTestId("catalog-entry-register-btn");
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

describe("CopyCatalogEntryButton rendering tests", () => {
   it("isAuthenticated true - test", async () => {
      const entry = dtestData.dCatalogEntry();
      const { container } = render(
         <CopyCatalogEntryButton entry={entry} isAuthenticated={true} />
      );

      await waitFor(() => {
         assertAuthenticatedBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated false - test", async () => {
      const entry = dtestData.dCatalogEntry();

      const { container } = render(
         <CopyCatalogEntryButton entry={entry} isAuthenticated={false} />
      );

      await waitFor(() => {
         assertNotAuthenticatedBtnRendered();
         assertAuthDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CopyCatalogEntryButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("unauthenticated - register btn clicked - opens auth dialog - test", async () => {
      const entry = dtestData.dCatalogEntry();
      render(<CopyCatalogEntryButton entry={entry} isAuthenticated={false} />);

      await waitFor(() => {
         assertNotAuthenticatedBtnRendered();
         assertAuthDialogNotRendered();
      });

      const btn = screen.getByTestId("catalog-entry-register-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertAuthDialogRendered();
      });
   });

   it("authenticated - copy btn clicked - success - test", async () => {
      const descriptorId = "descriptor-id-1";

      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Erfolgreich copiert",
         data: {
            templateId: descriptorId,
         },
      };
      copyCatalogEntryMock.mockResolvedValue(actionResult);

      const entry = dtestData.dCatalogEntry();
      render(<CopyCatalogEntryButton entry={entry} isAuthenticated={true} />);

      await waitFor(() => {
         assertAuthenticatedBtnRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("catalog-entry-copy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(copyCatalogEntryMock).toHaveBeenCalledTimes(1);
         expect(copyCatalogEntryMock).toHaveBeenCalledWith(entry.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(
            "Vorlage wurde in deine Library übernommen",
            expect.objectContaining({
               duration: 5000,
               action: expect.objectContaining({
                  label: "Jetzt anzeigen",
               }),
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

   it("authenticated - copy btn clicked - failure - test", async () => {
      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: false,
         message: "Vorlage konnte nicht copiert werden",
      };
      copyCatalogEntryMock.mockResolvedValue(actionResult);

      const entry = dtestData.dCatalogEntry();
      render(<CopyCatalogEntryButton entry={entry} isAuthenticated={true} />);

      const btn = screen.getByTestId("catalog-entry-copy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(copyCatalogEntryMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Vorlage konnte nicht übernommen werden"
         );
      });
   });
});
