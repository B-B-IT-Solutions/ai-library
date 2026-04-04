import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { metadata, NewCollectionPage } from "./page";

const expectedMetadata: Metadata = {
   title: "Neue Sammlung",
};

const assertRendered = () => {
   const page = screen.getByTestId("new-collection-page");
   const entryEdit = screen.getByTestId("collection-edit");

   assertInDocument(page);
   assertInDocument(entryEdit);
};

describe("NewCollectionPage rendering tests", () => {
   it("rendered test", async () => {
      const { container } = await renderAsyncRSC(NewCollectionPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("NewCollectionPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
