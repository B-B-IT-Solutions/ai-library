import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import PublicPage, { metadata } from "./page";

export const expectedMetadata: Metadata = {
   title: "",
};

const assertRendered = () => {
   const page = screen.getByTestId("public-page");

   assertInDocument(page);
};

describe("PublicPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PublicPage rendered test", async () => {
      const { container } = await renderAsyncRSC(PublicPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PublicPage functionality tests", () => {
   it("PublicPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
