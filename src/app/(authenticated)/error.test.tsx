import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import { AuthenticatedError } from "./error";

const assertRendered = () => {
   const error = screen.getByTestId("authenticated-error");
   const resetBtn = screen.getByTestId("reset-btn");

   assertInDocument(error);
   assertInDocument(resetBtn);
};

describe("AuthenticatedError rendering tests", () => {
   it("render - test", async () => {
      const error = new Error("Test error");

      const { container } = render(
         <AuthenticatedError error={error} reset={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AuthenticatedError functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   it("reset btn clicked - test", async () => {
      const error = new Error("Test error");

      const resetFn = jest.fn();

      render(<AuthenticatedError error={error} reset={resetFn} />);

      await waitFor(() => {
         assertRendered();
         expect(resetFn).not.toHaveBeenCalled();
      });

      const resetBtn = screen.getByTestId("reset-btn");
      userEvent.click(resetBtn);

      await waitFor(() => {
         expect(resetFn).toHaveBeenCalledTimes(1);
      });
   });
});
