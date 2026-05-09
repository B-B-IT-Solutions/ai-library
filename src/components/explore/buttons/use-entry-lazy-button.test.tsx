jest.mock("@/data/actions/catalog");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { getPublishedCatalogEntryBySlug } from "@/data/actions/catalog";

import { UseCatalogEntryLazyButton } from "./use-entry-lazy-button";

const getPublishedCatalogEntryBySlugMock =
   getPublishedCatalogEntryBySlug as jest.MockedFunction<
      typeof getPublishedCatalogEntryBySlug
   >;
const toastMock = toast as jest.Mocked<typeof toast>;

const assertRendered = () => {
   const btn = screen.getByTestId("use-entry-lazy-btn");
   assertInDocument(btn);
};

const assertDialogRendered = () => {
   const btn = screen.getByTestId("use-template-dialog");
   assertInDocument(btn);
};

const assertDialogNotRendered = () => {
   const btn = screen.queryByTestId("use-template-dialog");
   assertNotInDocument(btn);
};

describe("UseCatalogEntryLazyButton rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const { container } = render(
         <UseCatalogEntryLazyButton slug={entry.slug} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UseCatalogEntryLazyButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("btn clicked - success - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(entry);

      render(<UseCatalogEntryLazyButton slug={entry.slug} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const btn = screen.getByTestId("use-entry-lazy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertDialogRendered();
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(
            entry.slug
         );
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });

   it("btn clicked - error - test", async () => {
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(null);

      const slug = "catalog-entry-1";
      render(<UseCatalogEntryLazyButton slug={slug} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const btn = screen.getByTestId("use-entry-lazy-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertDialogNotRendered();
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(slug);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Vorlage konnte nicht geladen werden"
         );
      });
   });
});
