import { screen } from "@testing-library/dom";
import { assertInDocument, renderClient } from "@tests";

import AuthenticatedNotFound from "./not-found";

describe("AuthenticatedNotFound rendering tests", () => {
   it("AuthenticatedNotFound - renders 404 UI - test", () => {
      const { container } = renderClient(AuthenticatedNotFound, {});

      assertInDocument(screen.getByTestId("authenticated-not-found"));
      assertInDocument(screen.getByText("404"));
      assertInDocument(screen.getByText("Seite nicht gefunden"));
      assertInDocument(screen.getByRole("link", { name: "Zurück zu den Vorlagen" }));
      expect(container).toMatchSnapshot();
   });
});
