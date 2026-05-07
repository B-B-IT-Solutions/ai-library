jest.mock("@/data/actions/catalog");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { getPublishedCatalogEntryBySlug } from "@/data/actions/catalog";
import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";

import { CatalogEntryUseLazyButton } from "./catalog-entry-use-lazy-button";

const getPublishedCatalogEntryBySlugMock =
   getPublishedCatalogEntryBySlug as jest.MockedFunction<
      typeof getPublishedCatalogEntryBySlug
   >;
const toastMock = toast as jest.Mocked<typeof toast>;

describe("CatalogEntryUseLazyButton rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("Button wird gerendert - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const { container } = render(
         <CatalogEntryUseLazyButton slug={entry.slug} />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-entry-use-lazy-btn"));
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogEntryUseLazyButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("Klick triggert getPublishedCatalogEntryBySlug - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(entry);

      render(<CatalogEntryUseLazyButton slug={entry.slug} />);

      const btn = screen.getByTestId("catalog-entry-use-lazy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(
            entry.slug
         );
      });
   });

   it("Loading-Zustand während Fetch - test", async () => {
      let resolveAction!: (val: DCatalogEntryWithContent | null) => void;
      const pendingPromise = new Promise<DCatalogEntryWithContent | null>(
         (resolve) => {
            resolveAction = resolve;
         }
      );
      getPublishedCatalogEntryBySlugMock.mockReturnValue(pendingPromise);

      render(<CatalogEntryUseLazyButton slug="catalog-entry-1" />);
      const btn = screen.getByTestId("catalog-entry-use-lazy-btn");

      const clickPromise = userEvent.click(btn);

      await waitFor(() => {
         expect(btn).toBeDisabled();
      });

      resolveAction(null);
      await clickPromise;
   });

   it("Erfolgreicher Fetch öffnet Dialog - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(entry);

      render(<CatalogEntryUseLazyButton slug={entry.slug} />);

      const btn = screen.getByTestId("catalog-entry-use-lazy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("use-template-dialog"));
      });
   });

   it("Fehlgeschlagener Fetch zeigt Toast - test", async () => {
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(null);

      render(<CatalogEntryUseLazyButton slug="catalog-entry-1" />);

      const btn = screen.getByTestId("catalog-entry-use-lazy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Vorlage konnte nicht geladen werden"
         );
      });
   });

   it("Dialog schließt bei onCancel - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(entry);

      render(<CatalogEntryUseLazyButton slug={entry.slug} />);

      const btn = screen.getByTestId("catalog-entry-use-lazy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("use-template-dialog"));
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("use-template-dialog"));
      });
   });
});
