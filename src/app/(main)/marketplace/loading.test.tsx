import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import MarketplaceLoading from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("market-place-loading");
   assertInDocument(loading);
};

describe("MarketplaceLoading rendering tests", () => {
   it("MarketplaceLoading - products empty - test", async () => {
      const { container } = render(<MarketplaceLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
