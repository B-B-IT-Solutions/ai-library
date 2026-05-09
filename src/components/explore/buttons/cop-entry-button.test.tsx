jest.mock("@/data/actions/catalog");
jest.mock("sonner");

import { MouseEvent } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";
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

const assertNotAuthenticatedBtnRendered = (entrySlug: string) => {
   const btn = screen.getByTestId("catalog-entry-register-btn");
   assertInDocument(btn);
   assertHasAttributeWithValue(
      btn,
      "href",
      `/auth/sign-up?redirect=/explore/${entrySlug}`
   );
};

describe("CopyCatalogEntryButton rendering tests", () => {
   it("isAuthenticated true - test", async () => {
      const { container } = render(
         <CopyCatalogEntryButton
            catalogEntryId="entry-id-1"
            slug="entry-slug-1"
            isAuthenticated={true}
         />
      );

      await waitFor(() => {
         assertAuthenticatedBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated false - test", async () => {
      const entrySlug = "entry-slug-1";

      const { container } = render(
         <CopyCatalogEntryButton
            catalogEntryId="entry-id-1"
            slug={entrySlug}
            isAuthenticated={false}
         />
      );

      await waitFor(() => {
         assertNotAuthenticatedBtnRendered(entrySlug);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CopyCatalogEntryButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("unauthenticated - register btn clicked - test", async () => {
      const entrySlug = "entry-slug-1";

      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Erfolgreich copiert",
         data: {
            templateId: "descriptor-id-1",
         },
      };
      copyCatalogEntryMock.mockResolvedValue(actionResult);

      render(
         <CopyCatalogEntryButton
            catalogEntryId="entry-id-1"
            slug={entrySlug}
            isAuthenticated={false}
         />
      );

      await waitFor(() => {
         assertNotAuthenticatedBtnRendered(entrySlug);
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("catalog-entry-register-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(
            `/auth/sign-up?redirect=%2Fexplore%2F${entrySlug}`
         );
      });
   });

   it("authenticated - copy btn clicked - success - test", async () => {
      const catalogEntryId = "entry-id-1";
      const descriptorId = "descriptor-id-1";

      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Erfolgreich copiert",
         data: {
            templateId: descriptorId,
         },
      };
      copyCatalogEntryMock.mockResolvedValue(actionResult);

      render(
         <CopyCatalogEntryButton
            catalogEntryId={catalogEntryId}
            slug="entry-slug-1"
            isAuthenticated={true}
         />
      );

      await waitFor(() => {
         assertAuthenticatedBtnRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("catalog-entry-copy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(copyCatalogEntryMock).toHaveBeenCalledTimes(1);
         expect(copyCatalogEntryMock).toHaveBeenCalledWith(catalogEntryId);
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

      render(
         <CopyCatalogEntryButton
            catalogEntryId="entry-id-1"
            slug="entry-slug-1"
            isAuthenticated={true}
         />
      );

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
