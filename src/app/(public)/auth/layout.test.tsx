import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import AuthLayout from "./layout";

const assertRendered = () => {
   const layout = screen.getByTestId("auth-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("AuthLayout rendering tests", () => {
   it("AuthLayout rendered", async () => {
      const { container } = render(
         <AuthLayout>
            <div data-testid="test-1"></div>
         </AuthLayout>
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
