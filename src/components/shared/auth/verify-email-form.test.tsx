jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";

import { resendVerificationEmail } from "@/data/actions/user";
import { ActionResult } from "@/data/types/utils";

import { VerifyEmailForm } from "./verify-email-form";

const resendEmailMock = resendVerificationEmail as jest.MockedFunction<
   typeof resendVerificationEmail
>;

const assertRendered = () => {
   const form = screen.getByTestId("verify-email-form");
   const link = screen.getByTestId("sign-in-link");

   assertInDocument(form);
   assertInDocument(link);

   assertHasAttributeWithValue(link, "href", "/auth/sign-in");
};

const assertResendRendered = () => {
   const info = screen.getByTestId("email-info");
   const resendBtn = screen.getByTestId("resend-btn");

   assertInDocument(info);
   assertInDocument(resendBtn);
};

const assertResendResultRendered = () => {
   const result = screen.getByTestId("resend-result");
   assertInDocument(result);
};

const assertResendNotRendered = () => {
   const info = screen.queryByTestId("email-info");
   const resendBtn = screen.queryByTestId("resend-btn");

   assertNotInDocument(info);
   assertNotInDocument(resendBtn);
};

describe("VerifyEmailForm rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("email defined - test", async () => {
      const email = "user@test.com";

      const { container } = render(<VerifyEmailForm email={email} />);

      await waitFor(() => {
         assertRendered();
         assertResendRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("email undefined - test", async () => {
      const { container } = render(<VerifyEmailForm />);

      await waitFor(() => {
         assertRendered();
         assertResendNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("VerifyEmailForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("resend clicked - success - test", async () => {
      const email = "user@test.com";
      const result: ActionResult = {
         success: true,
         message: "E-Mail wurde gesendet",
      };
      resendEmailMock.mockResolvedValue(result);

      render(<VerifyEmailForm email={email} />);

      await waitFor(() => {
         assertRendered();
         assertResendRendered();
         expect(resendEmailMock).not.toHaveBeenCalled();
      });

      const resendBtn = screen.getByTestId("resend-btn");
      await userEvent.click(resendBtn);

      await waitFor(() => {
         assertResendResultRendered();
         expect(resendEmailMock).toHaveBeenCalledTimes(1);
         expect(resendEmailMock).toHaveBeenCalledWith(email);
      });
   });

   it("resend clicked - error - test", async () => {
      const email = "user@test.com";
      const result: ActionResult = {
         success: false,
         message: "Fehler beim Senden",
      };
      resendEmailMock.mockResolvedValue(result);

      render(<VerifyEmailForm email={email} />);

      await waitFor(() => {
         assertRendered();
         assertResendRendered();
         expect(resendEmailMock).not.toHaveBeenCalled();
      });

      const resendBtn = screen.getByTestId("resend-btn");
      await userEvent.click(resendBtn);

      await waitFor(() => {
         assertResendResultRendered();
         expect(resendEmailMock).toHaveBeenCalledTimes(1);
         expect(resendEmailMock).toHaveBeenCalledWith(email);
      });
   });
});
