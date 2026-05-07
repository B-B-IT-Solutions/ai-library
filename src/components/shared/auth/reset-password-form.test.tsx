jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { resetPassword } from "@/data/actions/user";
import { DResetPassword } from "@/data/types/domain/user";
import { ActionResult } from "@/data/types/utils";

import { ResetPasswordForm } from "./reset-password-form";

const resetPasswordMock = resetPassword as jest.MockedFunction<
   typeof resetPassword
>;

const email = "user@test.com";
const token = "reset-token-123";

const assertFormRendered = () => {
   const form = screen.getByTestId("reset-password-form");
   const passwordField = screen.getByTestId("password-field");
   const passwordInput = screen.getByTestId("password-input");
   const confirmField = screen.getByTestId("confirm-password-field");
   const confirmInput = screen.getByTestId("confirm-password-input");
   const submitBtn = screen.getByTestId("submit-reset-password-btn");

   assertInDocument(form);
   assertInDocument(passwordField);
   assertInDocument(passwordInput);
   assertInDocument(confirmField);
   assertInDocument(confirmInput);
   assertInDocument(submitBtn);
};

describe("ResetPasswordForm rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders form - test", async () => {
      const { container } = render(
         <ResetPasswordForm email={email} token={token} />
      );

      await waitFor(() => {
         assertFormRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ResetPasswordForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("toggle password visibility - test", async () => {
      render(<ResetPasswordForm email={email} token={token} />);

      await waitFor(() => {
         assertFormRendered();
      });

      const passwordInput = screen.getByTestId("password-input");
      assertHasAttributeWithValue(passwordInput, "type", "password");

      const toggleBtn = screen.getByTestId("toggle-password-visibility");
      await userEvent.click(toggleBtn);

      await waitFor(() => {
         assertHasAttributeWithValue(passwordInput, "type", "text");
      });

      await userEvent.click(toggleBtn);

      await waitFor(() => {
         assertHasAttributeWithValue(passwordInput, "type", "password");
      });
   });

   it("toggle confirm password visibility - test", async () => {
      render(<ResetPasswordForm email={email} token={token} />);

      await waitFor(() => {
         assertFormRendered();
      });

      const confirmInput = screen.getByTestId("confirm-password-input");
      assertHasAttributeWithValue(confirmInput, "type", "password");

      const toggleBtn = screen.getByTestId("toggle-confirm-visibility");
      await userEvent.click(toggleBtn);

      await waitFor(() => {
         assertHasAttributeWithValue(confirmInput, "type", "text");
      });

      await userEvent.click(toggleBtn);

      await waitFor(() => {
         assertHasAttributeWithValue(confirmInput, "type", "password");
      });
   });

   it("submit empty form - no action called - test", async () => {
      render(<ResetPasswordForm email={email} token={token} />);

      await waitFor(() => {
         assertFormRendered();
      });

      const submitBtn = screen.getByTestId("submit-reset-password-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(resetPasswordMock).not.toHaveBeenCalled();
      });
   });

   it("submit short password - validation error - no action called - test", async () => {
      render(<ResetPasswordForm email={email} token={token} />);

      await waitFor(() => {
         assertFormRendered();
      });

      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(passwordInput, "abc");

      const confirmInput = screen.getByTestId("confirm-password-input");
      await userEvent.type(confirmInput, "abc");

      const submitBtn = screen.getByTestId("submit-reset-password-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(resetPasswordMock).not.toHaveBeenCalled();
      });
   });

   it("submit mismatched passwords - validation error - no action called - test", async () => {
      render(<ResetPasswordForm email={email} token={token} />);

      await waitFor(() => {
         assertFormRendered();
      });

      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(passwordInput, "password123");

      const confirmInput = screen.getByTestId("confirm-password-input");
      await userEvent.type(confirmInput, "different123");

      const submitBtn = screen.getByTestId("submit-reset-password-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(resetPasswordMock).not.toHaveBeenCalled();
      });
   });

   it("submit valid - success - redirects to sign-in - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Passwort erfolgreich zurückgesetzt",
      };
      resetPasswordMock.mockResolvedValue(result);

      render(<ResetPasswordForm email={email} token={token} />);

      await waitFor(() => {
         assertFormRendered();
      });

      const password = "newpassword123";
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(passwordInput, password);

      const confirmInput = screen.getByTestId("confirm-password-input");
      await userEvent.type(confirmInput, password);

      const submitBtn = screen.getByTestId("submit-reset-password-btn");
      await userEvent.click(submitBtn);

      const expectedData: DResetPassword = {
         password,
         confirmPassword: password,
      };

      await waitFor(() => {
         expect(resetPasswordMock).toHaveBeenCalledTimes(1);
         expect(resetPasswordMock).toHaveBeenCalledWith(
            email,
            token,
            expectedData
         );
         expect(mockRouter.asPath).toEqual("/auth/sign-in?password_reset=true");
      });
   });

   it("submit valid - failure - shows server error - test", async () => {
      const errorMessage =
         "Fehler beim Zurücksetzen des Passworts. Der Link ist möglicherweise ungültig oder abgelaufen.";
      const result: ActionResult = {
         success: false,
         message: errorMessage,
      };
      resetPasswordMock.mockResolvedValue(result);

      render(<ResetPasswordForm email={email} token={token} />);

      await waitFor(() => {
         assertFormRendered();
      });

      const password = "newpassword123";
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(passwordInput, password);

      const confirmInput = screen.getByTestId("confirm-password-input");
      await userEvent.type(confirmInput, password);

      const submitBtn = screen.getByTestId("submit-reset-password-btn");
      await userEvent.click(submitBtn);

      const expectedData: DResetPassword = {
         password,
         confirmPassword: password,
      };

      await waitFor(() => {
         expect(resetPasswordMock).toHaveBeenCalledTimes(1);
         expect(resetPasswordMock).toHaveBeenCalledWith(
            email,
            token,
            expectedData
         );
         expect(screen.getByText(errorMessage)).toBeInTheDocument();
         expect(mockRouter.asPath).toEqual("/");
      });
   });
});
