import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import { AuthenticatedError } from "./error";

const assertRendered = () => {
   const error = screen.getByTestId("authenticated-error");
   const retryBtn = screen.getByTestId("retry-btn");

   assertInDocument(error);
   assertInDocument(retryBtn);
};

describe("AuthenticatedError rendering tests", () => {
   beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   it("render - test", async () => {
      const error = new Error("Test error");

      const { container } = render(
         <AuthenticatedError error={error} unstable_retry={jest.fn()} />
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

   it("retry btn clicked - test", async () => {
      const error = new Error("Test error");

      const retryFn = jest.fn();

      render(<AuthenticatedError error={error} unstable_retry={retryFn} />);

      await waitFor(() => {
         assertRendered();
         expect(retryFn).not.toHaveBeenCalled();
      });

      const retryBtn = screen.getByTestId("retry-btn");
      userEvent.click(retryBtn);

      await waitFor(() => {
         expect(retryFn).toHaveBeenCalledTimes(1);
      });
   });
});
