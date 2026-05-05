jest.mock("@/data/actions/catalog");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { copyCatalogEntryToUserLibrary } from "@/data/actions/catalog";

import { ExploreCopyButton } from "./explore-copy-button";

const copyCatalogEntryMock = copyCatalogEntryToUserLibrary as jest.MockedFunction<
   typeof copyCatalogEntryToUserLibrary
>;
const toastMock = toast as jest.Mocked<typeof toast>;

const CATALOG_ENTRY_ID = "entry-uuid-0001";
const SLUG = "catalog-entry-1";

describe("ExploreCopyButton - unauthenticated - rendering tests", () => {
   it("unauthenticated - renders register link - test", async () => {
      const { container } = render(
         <ExploreCopyButton
            catalogEntryId={CATALOG_ENTRY_ID}
            slug={SLUG}
            isAuthenticated={false}
         />
      );

      await waitFor(() => {
         const btn = screen.getByTestId("explore-copy-btn-register");
         assertInDocument(btn);
         expect(btn).toHaveAttribute(
            "href",
            `/auth/sign-up?redirect=/explore/${SLUG}`
         );
      });

      expect(container).toMatchSnapshot();
   });

   it("unauthenticated - does not render authenticated button - test", async () => {
      render(
         <ExploreCopyButton
            catalogEntryId={CATALOG_ENTRY_ID}
            slug={SLUG}
            isAuthenticated={false}
         />
      );

      await waitFor(() => {
         expect(screen.queryByTestId("explore-copy-btn")).not.toBeInTheDocument();
      });
   });
});

describe("ExploreCopyButton - authenticated - rendering tests", () => {
   it("authenticated - renders copy button - test", async () => {
      const { container } = render(
         <ExploreCopyButton
            catalogEntryId={CATALOG_ENTRY_ID}
            slug={SLUG}
            isAuthenticated={true}
         />
      );

      await waitFor(() => {
         const btn = screen.getByTestId("explore-copy-btn");
         assertInDocument(btn);
      });

      expect(container).toMatchSnapshot();
   });

   it("authenticated - does not render register link - test", async () => {
      render(
         <ExploreCopyButton
            catalogEntryId={CATALOG_ENTRY_ID}
            slug={SLUG}
            isAuthenticated={true}
         />
      );

      await waitFor(() => {
         expect(screen.queryByTestId("explore-copy-btn-register")).not.toBeInTheDocument();
      });
   });
});

describe("ExploreCopyButton - authenticated - functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("authenticated - copy success - shows success toast - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      copyCatalogEntryMock.mockResolvedValue({
         success: true,
         templateId: descriptor.id,
      });

      render(
         <ExploreCopyButton
            catalogEntryId={CATALOG_ENTRY_ID}
            slug={SLUG}
            isAuthenticated={true}
         />
      );

      const btn = screen.getByTestId("explore-copy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(copyCatalogEntryMock).toHaveBeenCalledTimes(1);
         expect(copyCatalogEntryMock).toHaveBeenCalledWith(CATALOG_ENTRY_ID);
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
   });

   it("authenticated - copy failure - shows error toast - test", async () => {
      copyCatalogEntryMock.mockResolvedValue({
         success: false,
         error: "Something went wrong",
      });

      render(
         <ExploreCopyButton
            catalogEntryId={CATALOG_ENTRY_ID}
            slug={SLUG}
            isAuthenticated={true}
         />
      );

      const btn = screen.getByTestId("explore-copy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(copyCatalogEntryMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Vorlage konnte nicht übernommen werden"
         );
      });
   });

   it("authenticated - success - toast action navigates to template - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      copyCatalogEntryMock.mockResolvedValue({
         success: true,
         templateId: descriptor.id,
      });

      render(
         <ExploreCopyButton
            catalogEntryId={CATALOG_ENTRY_ID}
            slug={SLUG}
            isAuthenticated={true}
         />
      );

      const btn = screen.getByTestId("explore-copy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(toastMock.success).toHaveBeenCalledTimes(1);
      });

      // Invoke the action onClick to verify router.push is called
      const toastCall = toastMock.success.mock.calls[0];
      const toastOptions = toastCall[1] as { action: { onClick: () => void } };
      toastOptions.action.onClick();

      expect(mockRouter.push).toHaveBeenCalledWith(`/templates/${descriptor.id}`);
   });
});
