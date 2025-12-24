import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, ctestData, renderAsyncRSC } from "@tests";

import PublicLayout from "./layout";

const assertRendered = () => {
   const layout = screen.getByTestId("public-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("PublicLayout rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("PublicLayout rendered test", async () => {
      const { container } = await renderAsyncRSC(PublicLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
