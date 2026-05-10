import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import ExploreNotFound from "./not-found";

describe("ExploreNotFound rendering tests", () => {
   it("ExploreNotFound - renders 404 UI - test", () => {
      const { container } = render(<ExploreNotFound />);

      assertInDocument(screen.getByTestId("explore-not-found"));
      assertInDocument(screen.getByText("404"));
      assertInDocument(screen.getByText("Seite nicht gefunden"));
      assertInDocument(screen.getByRole("link", { name: "Zum Entdecken" }));
      expect(container).toMatchSnapshot();
   });
});
