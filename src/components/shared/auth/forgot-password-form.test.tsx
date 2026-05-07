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
import { DForgotPassword } from "@/data/types/domain/user";
import { ActionResult } from "@/data/types/utils";

import { ForgotPasswordForm } from "./forgot-password-form";

const requestPasswordResetMock = requestPasswordReset as jest.MockedFunction<
   typeof requestPasswordReset
>;

const assertFormRendered = () => {
   const form = screen.getByTestId("forgot-password-form");
   const emailField = screen.getByTestId("email-field");
   const emailInput = screen.getByTestId("email-input");
   const resetBtn = screen.getByTestId("reset-password-btn");
   const signInLink = screen.getByTestId("sign-in-link");

   assertInDocument(form);
   assertInDocument(emailField);
   assertInDocument(emailInput);
   assertInDocument(resetBtn);
   assertInDocument(signInLink);

   assertHasAttributeWithValue(signInLink, "href", "/auth/sign-in");
};

const assertFormNotRendered = () => {
   const form = screen.queryByTestId("forgot-password-form");
   assertNotInDocument(form);
};

const assertEmailSentBannerRendered = () => {
   const banner = screen.getByTestId("reset-email-sent-banner");
   assertInDocument(banner);
};

const assertEmailSentBannerNotRendered = () => {
   const banner = screen.queryByTestId("reset-email-sent-banner");
   assertNotInDocument(banner);
};

describe("ForgotPasswordForm rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders form - test", async () => {
      const { container } = render(<ForgotPasswordForm />);

      await waitFor(() => {
         assertFormRendered();
         assertEmailSentBannerNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ForgotPasswordForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("password reset - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "E-Mail gesendet",
      };
      requestPasswordResetMock.mockResolvedValue(result);

      render(<ForgotPasswordForm />);

      await waitFor(() => {
         assertFormRendered();
         assertEmailSentBannerNotRendered();
      });

      const resetBtn = screen.getByTestId("reset-password-btn");
      await userEvent.click(resetBtn);

      await waitFor(() => {
         assertFormRendered();
         assertEmailSentBannerNotRendered();
         expect(requestPasswordResetMock).not.toHaveBeenCalled();
      });

      const value = "user@test.com";
      const emailInput = screen.getByTestId("email-input");
      await userEvent.type(emailInput, value);

      await userEvent.click(resetBtn);

      const expectedPayload: DForgotPassword = {
         email: value,
      };
      await waitFor(() => {
         assertFormNotRendered();
         assertEmailSentBannerRendered();
         expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);
         expect(requestPasswordResetMock).toHaveBeenCalledWith(expectedPayload);
      });
   });

   it("password reset - error - test", async () => {
      const errorMessage = "Fehler beim Senden der E-Mail";
      const result: ActionResult = {
         success: false,
         message: errorMessage,
      };
      requestPasswordResetMock.mockResolvedValue(result);

      render(<ForgotPasswordForm />);

      await waitFor(() => {
         assertFormRendered();
         assertEmailSentBannerNotRendered();
      });

      const value = "user@test.com";
      const emailInput = screen.getByTestId("email-input");
      await userEvent.type(emailInput, value);

      const resetBtn = screen.getByTestId("reset-password-btn");
      await userEvent.click(resetBtn);

      const expectedPayload: DForgotPassword = {
         email: value,
      };

      await waitFor(() => {
         assertFormRendered();
         assertEmailSentBannerNotRendered();
         expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);
         expect(requestPasswordResetMock).toHaveBeenCalledWith(expectedPayload);
      });
   });
});
