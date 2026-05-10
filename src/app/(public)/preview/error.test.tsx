import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import PreviewError from "./error";

describe("PreviewError rendering tests", () => {
   const error = new Error("Test error");
   const resetMock = jest.fn();

   beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   it("PreviewError - renders error UI - test", () => {
      const { container } = render(
         <PreviewError error={error} reset={resetMock} />
      );

      assertInDocument(screen.getByTestId("preview-error"));
      assertInDocument(screen.getByText("Etwas ist schiefgelaufen"));
      assertInDocument(screen.getByRole("button", { name: "Erneut versuchen" }));
      assertInDocument(screen.getByRole("link", { name: "Zur Bibliothek" }));
      expect(container).toMatchSnapshot();
   });

   it("PreviewError - calls reset on button click - test", async () => {
      render(<PreviewError error={error} reset={resetMock} />);

      await userEvent.click(
         screen.getByRole("button", { name: "Erneut versuchen" })
      );

      expect(resetMock).toHaveBeenCalledTimes(1);
   });
});
