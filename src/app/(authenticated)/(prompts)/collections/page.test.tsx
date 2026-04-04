jest.mock("@/components/collections", () => ({
   CollectionsDashboard: () => {
      return <div data-testid="collections-dashboard" />;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { CollectionsPage, metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Sammlungen",
};

const assertRendered = () => {
   const page = screen.getByTestId("collections-page");
   const dashboard = screen.getByTestId("collections-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("CollectionsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("page rendered - test", async () => {
      const { container } = await renderAsyncRSC(CollectionsPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionsPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
