import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { FunnelLayout } from "./layout";

const assertRendered = () => {
   const layout = screen.getByTestId("funnel-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("FunnelLayout rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(
         <FunnelLayout>
            <div data-testid="test-1"></div>
         </FunnelLayout>
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
