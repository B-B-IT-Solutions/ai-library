import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { Providers } from "./providers";

const assertRendered = () => {
   const test1 = screen.getByTestId("test-1");
   assertInDocument(test1);
};

describe("Providers rendering tests", () => {
   it("Providers rendered", async () => {
      const { container } = render(
         <Providers>
            <div data-testid="test-1"></div>
         </Providers>
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
