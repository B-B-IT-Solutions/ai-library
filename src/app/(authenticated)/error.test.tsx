import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderClient } from "@tests";

import AuthenticatedError from "./error";

describe("AuthenticatedError rendering tests", () => {
   const error = new Error("Test error");
   const resetMock = jest.fn();

   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("AuthenticatedError - renders error UI - test", () => {
      const { container } = renderClient(AuthenticatedError, {
         error,
         reset: resetMock,
      });

      assertInDocument(screen.getByTestId("authenticated-error"));
      assertInDocument(screen.getByText("Etwas ist schiefgelaufen"));
      assertInDocument(screen.getByRole("button", { name: "Erneut versuchen" }));
      expect(container).toMatchSnapshot();
   });

   it("AuthenticatedError - calls reset on button click - test", async () => {
      renderClient(AuthenticatedError, { error, reset: resetMock });

      await userEvent.click(
         screen.getByRole("button", { name: "Erneut versuchen" })
      );

      expect(resetMock).toHaveBeenCalledTimes(1);
   });
});
