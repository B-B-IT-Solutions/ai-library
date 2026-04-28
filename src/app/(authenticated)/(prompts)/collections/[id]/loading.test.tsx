import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { CollectionLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("collection-loading");
   assertInDocument(loading);
};

describe("CollectionLoading rendering tests", () => {
   it("rendered test", async () => {
      const { container } = render(<CollectionLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
