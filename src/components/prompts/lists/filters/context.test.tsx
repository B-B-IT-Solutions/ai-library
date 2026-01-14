import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { FiltersContextProvider } from "./context";

const assertRendered = () => {
   const section = screen.getByTestId("test-1");
   assertInDocument(section);
};

describe("FiltersContextProvider rendering tests", () => {
   test("FiltersContextProvider rendered test", async () => {
      const { container } = render(
         <FiltersContextProvider>
            <div data-testid="test-1"></div>
         </FiltersContextProvider>
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
