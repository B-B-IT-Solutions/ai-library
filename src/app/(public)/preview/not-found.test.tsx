import { screen } from "@testing-library/dom";
import { assertInDocument, renderClient } from "@tests";

import PreviewNotFound from "./not-found";

describe("PreviewNotFound rendering tests", () => {
   it("PreviewNotFound - renders 404 UI - test", () => {
      const { container } = renderClient(PreviewNotFound, {});

      assertInDocument(screen.getByTestId("preview-not-found"));
      assertInDocument(screen.getByText("404"));
      assertInDocument(screen.getByText("Seite nicht gefunden"));
      assertInDocument(screen.getByRole("link", { name: "Zur Bibliothek" }));
      expect(container).toMatchSnapshot();
   });
});
