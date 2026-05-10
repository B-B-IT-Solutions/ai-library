import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { ExplorePageLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("explore-page-loading");
   assertInDocument(loading);
};

describe("ExplorePageLoading rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(<ExplorePageLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
