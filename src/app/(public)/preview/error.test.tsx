import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderClient } from "@tests";

import PreviewError from "./error";

describe("PreviewError rendering tests", () => {
   const error = new Error("Test error");
   const resetMock = jest.fn();

   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PreviewError - renders error UI - test", () => {
      const { container } = renderClient(PreviewError, {
         error,
         reset: resetMock,
      });

      assertInDocument(screen.getByTestId("preview-error"));
      assertInDocument(screen.getByText("Etwas ist schiefgelaufen"));
      assertInDocument(screen.getByRole("button", { name: "Erneut versuchen" }));
      assertInDocument(screen.getByRole("link", { name: "Zur Bibliothek" }));
      expect(container).toMatchSnapshot();
   });

   it("PreviewError - calls reset on button click - test", async () => {
      renderClient(PreviewError, { error, reset: resetMock });

      await userEvent.click(
         screen.getByRole("button", { name: "Erneut versuchen" })
      );

      expect(resetMock).toHaveBeenCalledTimes(1);
   });
});
