jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   renderWithRouter,
} from "@tests";
import mockRouter from "next-router-mock";

import { resendVerificationEmail } from "@/data/actions/user";

import { VerifyEmailForm } from "./verify-email-form";

const resendMock = resendVerificationEmail as jest.MockedFunction<
   typeof resendVerificationEmail
>;

const assertRendered = () => {
   assertInDocument(screen.getByTestId("verify-email-form"));
   assertInDocument(screen.getByTestId("sign-in-link"));
};

describe("VerifyEmailForm rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("VerifyEmailForm - email defined - renders with email display and resend btn - test", async () => {
      const email = "user@test.com";

      const { container } = render(<VerifyEmailForm email={email} />);

      await waitFor(() => {
         assertRendered();
         assertInDocument(screen.getByTestId("email-display"));
         assertInDocument(screen.getByTestId("resend-btn"));
         expect(screen.getByTestId("email-display")).toHaveTextContent(email);
      });

      expect(container).toMatchSnapshot();
   });

   it("VerifyEmailForm - email undefined - renders without email display and resend btn - test", async () => {
      const { container } = render(<VerifyEmailForm />);

      await waitFor(() => {
         assertRendered();
         assertNotInDocument(screen.queryByTestId("email-display"));
         assertNotInDocument(screen.queryByTestId("resend-btn"));
      });

      expect(container).toMatchSnapshot();
   });

   it("VerifyEmailForm - sign-in link has correct href - test", async () => {
      const url = "/auth/sign-in";
      renderWithRouter(<VerifyEmailForm />, url);

      await waitFor(() => {
         const link = screen.getByTestId("sign-in-link");
         assertHasAttributeWithValue(link, "href", url);
         expect(mockRouter.pathname).toEqual(url);
      });
   });
});

describe("VerifyEmailForm functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("VerifyEmailForm - resend clicked - success - shows success message - test", async () => {
      const email = "user@test.com";
      resendMock.mockResolvedValue({
         success: true,
         message: "E-Mail wurde gesendet",
      });

      render(<VerifyEmailForm email={email} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("resend-btn"));
      });

      await userEvent.click(screen.getByTestId("resend-btn"));

      await waitFor(() => {
         expect(resendMock).toHaveBeenCalledTimes(1);
         expect(resendMock).toHaveBeenCalledWith(email);
         assertInDocument(screen.getByTestId("resend-message"));
         expect(screen.getByTestId("resend-message")).toHaveTextContent(
            "E-Mail wurde gesendet"
         );
      });
   });

   it("VerifyEmailForm - resend clicked - error - shows error message - test", async () => {
      const email = "user@test.com";
      resendMock.mockResolvedValue({
         success: false,
         message: "Fehler beim Senden",
      });

      render(<VerifyEmailForm email={email} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("resend-btn"));
      });

      await userEvent.click(screen.getByTestId("resend-btn"));

      await waitFor(() => {
         expect(resendMock).toHaveBeenCalledTimes(1);
         expect(resendMock).toHaveBeenCalledWith(email);
         assertInDocument(screen.getByTestId("resend-message"));
         expect(screen.getByTestId("resend-message")).toHaveTextContent(
            "Fehler beim Senden"
         );
      });
   });

   it("VerifyEmailForm - resend clicked - clears previous message before new request - test", async () => {
      const email = "user@test.com";
      resendMock
         .mockResolvedValueOnce({ success: false, message: "Erster Fehler" })
         .mockResolvedValueOnce({
            success: true,
            message: "Jetzt erfolgreich",
         });

      render(<VerifyEmailForm email={email} />);

      await userEvent.click(screen.getByTestId("resend-btn"));

      await waitFor(() => {
         expect(screen.getByTestId("resend-message")).toHaveTextContent(
            "Erster Fehler"
         );
      });

      await userEvent.click(screen.getByTestId("resend-btn"));

      await waitFor(() => {
         expect(screen.getByTestId("resend-message")).toHaveTextContent(
            "Jetzt erfolgreich"
         );
      });

      expect(resendMock).toHaveBeenCalledTimes(2);
   });

   it("VerifyEmailForm - email undefined - resend btn not rendered - action not called - test", async () => {
      render(<VerifyEmailForm />);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("resend-btn"));
      });

      expect(resendMock).not.toHaveBeenCalled();
   });
});
