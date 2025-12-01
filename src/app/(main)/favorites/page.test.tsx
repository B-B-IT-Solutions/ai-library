import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import FavoritesPage, { metadata } from "./page";

export const expectedMetadata: Metadata = {
   title: "Favorites",
};

const assertRendered = () => {
   const page = screen.getByTestId("favorites-page");
   const favorites = screen.getByTestId("favorites");

   assertInDocument(page);
   assertInDocument(favorites);
};

describe("FavoritesPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("FavoritesPage - prompts retrieved - rendered test", async () => {
      const { container } = await renderAsyncRSC(FavoritesPage);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("FavoritesPage functionality tests", () => {
   it("FavoritesPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
