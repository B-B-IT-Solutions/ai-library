import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";

import PublicPage from "./page";

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
