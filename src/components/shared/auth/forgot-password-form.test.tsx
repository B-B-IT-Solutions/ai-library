jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";

import { requestPasswordReset } from "@/data/actions/user";
import { ActionResult } from "@/data/types/utils";

import { ForgotPasswordForm } from "./forgot-password-form";

const requestPasswordResetMock = requestPasswordReset as jest.MockedFunction<
   typeof requestPasswordReset
>;

const assertFormRendered = () => {
   const form = screen.getByTestId("forgot-password-form");
   const emailField = screen.getByTestId("email-field");
   const submitBtn = screen.getByTestId("reset-password-btn");
   const signInLink = screen.getByTestId("sign-in-link");

   assertInDocument(form);
   assertInDocument(emailField);
   assertInDocument(submitBtn);
   assertInDocument(signInLink);

   assertHasAttributeWithValue(signInLink, "href", "/auth/sign-in");
};

describe("ForgotPasswordForm rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders form - test", async () => {
      const { container } = render(<ForgotPasswordForm />);

      await waitFor(() => {
         assertFormRendered();
         assertNotInDocument(screen.queryByTestId("reset-email-sent-banner"));
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ForgotPasswordForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit valid email - success - shows banner - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "E-Mail gesendet",
      };
      requestPasswordResetMock.mockResolvedValue(result);

      render(<ForgotPasswordForm />);

      await waitFor(() => assertFormRendered());

      const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
      await userEvent.type(emailInput, "user@test.com");

      const submitBtn = screen.getByTestId("reset-password-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("reset-email-sent-banner"));
         assertNotInDocument(screen.queryByTestId("forgot-password-form"));
         expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);
         expect(requestPasswordResetMock).toHaveBeenCalledWith({
            email: "user@test.com",
         });
      });
   });

   it("submit valid email - failure - shows server error - test", async () => {
      const errorMessage = "Fehler beim Senden der E-Mail";
      const result: ActionResult = {
         success: false,
         message: errorMessage,
      };
      requestPasswordResetMock.mockResolvedValue(result);

      render(<ForgotPasswordForm />);

      await waitFor(() => assertFormRendered());

      const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
      await userEvent.type(emailInput, "user@test.com");

      const submitBtn = screen.getByTestId("reset-password-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("reset-email-sent-banner"));
         expect(screen.getByText(errorMessage)).toBeInTheDocument();
         expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);
      });
   });

   it("submit invalid email - shows validation error - no action called - test", async () => {
      render(<ForgotPasswordForm />);

      await waitFor(() => assertFormRendered());

      const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
      await userEvent.type(emailInput, "not-an-email");

      const submitBtn = screen.getByTestId("reset-password-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("reset-email-sent-banner"));
         expect(requestPasswordResetMock).not.toHaveBeenCalled();
      });
   });
});
