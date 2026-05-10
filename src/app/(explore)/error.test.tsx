import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderClient } from "@tests";

import ExploreError from "./error";

describe("ExploreError rendering tests", () => {
   const error = new Error("Test error");
   const resetMock = jest.fn();

   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("ExploreError - renders error UI - test", () => {
      const { container } = renderClient(ExploreError, {
         error,
         reset: resetMock,
      });

      assertInDocument(screen.getByTestId("explore-error"));
      assertInDocument(screen.getByText("Etwas ist schiefgelaufen"));
      assertInDocument(screen.getByRole("button", { name: "Erneut versuchen" }));
      assertInDocument(screen.getByRole("link", { name: "Zum Entdecken" }));
      expect(container).toMatchSnapshot();
   });

   it("ExploreError - calls reset on button click - test", async () => {
      renderClient(ExploreError, { error, reset: resetMock });

      await userEvent.click(
         screen.getByRole("button", { name: "Erneut versuchen" })
      );

      expect(resetMock).toHaveBeenCalledTimes(1);
   });
});
