import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import MainLayout from "./layout";

const assertRendered = () => {
   const layout = screen.getByTestId("main-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("MainLayout rendering tests", () => {
   it("MainLayout rendered", async () => {
      const { container } = render(
         <MainLayout>
            <div data-testid="test-1"></div>
         </MainLayout>
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
