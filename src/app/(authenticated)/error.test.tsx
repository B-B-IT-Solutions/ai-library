import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import AuthenticatedError from "./error";

describe("AuthenticatedError rendering tests", () => {
   const error = new Error("Test error");
   const resetMock = jest.fn();

   beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   it("AuthenticatedError - renders error UI - test", () => {
      const { container } = render(
         <AuthenticatedError error={error} reset={resetMock} />
      );

      assertInDocument(screen.getByTestId("authenticated-error"));
      assertInDocument(screen.getByText("Etwas ist schiefgelaufen"));
      assertInDocument(screen.getByRole("button", { name: "Erneut versuchen" }));
      expect(container).toMatchSnapshot();
   });

   it("AuthenticatedError - calls reset on button click - test", async () => {
      render(<AuthenticatedError error={error} reset={resetMock} />);

      await userEvent.click(
         screen.getByRole("button", { name: "Erneut versuchen" })
      );

      expect(resetMock).toHaveBeenCalledTimes(1);
   });
});
