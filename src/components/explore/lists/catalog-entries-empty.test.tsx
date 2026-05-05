import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { CatalogEntriesEmpty } from "./catalog-entries-empty";

const assertRendered = () => {
   const empty = screen.getByTestId("catalog-entries-empty");
   assertInDocument(empty);
};

describe("CatalogEntriesEmpty rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(<CatalogEntriesEmpty />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
