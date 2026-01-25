import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import MainPage, { metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Startseite",
};

const assertRendered = () => {
   const page = screen.getByTestId("main-page");

   assertInDocument(page);
};

describe("MainPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("MainPage rendered test", async () => {
      const { container } = await renderAsyncRSC(MainPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MainPage functionality tests", () => {
   it("MainPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
