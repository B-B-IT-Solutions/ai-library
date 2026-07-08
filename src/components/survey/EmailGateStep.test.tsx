import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmailGateStep } from "./EmailGateStep";

describe("EmailGateStep", () => {
   const onSubmit = jest.fn();

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders headline and form fields", () => {
      render(<EmailGateStep onSubmit={onSubmit} isLoading={false} />);
      expect(screen.getByText("Fast geschafft!")).toBeInTheDocument();
      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("firstname-input")).toBeInTheDocument();
      expect(screen.getByTestId("consent-checkbox")).toBeInTheDocument();
   });

   it("shows email error when submitting with empty email", async () => {
      render(<EmailGateStep onSubmit={onSubmit} isLoading={false} />);
      await userEvent.click(screen.getByTestId("submit-button"));
      expect(
         screen.getByText("Bitte gib eine gültige E-Mail-Adresse ein.")
      ).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
   });

   it("shows email error for invalid email format", async () => {
      render(<EmailGateStep onSubmit={onSubmit} isLoading={false} />);
      await userEvent.type(screen.getByTestId("email-input"), "notanemail");
      await userEvent.click(screen.getByTestId("submit-button"));
      expect(screen.getByTestId("email-error")).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
   });

   it("shows consent error when email is valid but consent is not checked", async () => {
      render(<EmailGateStep onSubmit={onSubmit} isLoading={false} />);
      await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
      await userEvent.click(screen.getByTestId("submit-button"));
      expect(screen.getByTestId("consent-error")).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
   });

   it("calls onSubmit with email and firstName when form is valid", async () => {
      onSubmit.mockResolvedValue(undefined);
      render(<EmailGateStep onSubmit={onSubmit} isLoading={false} />);
      await userEvent.type(screen.getByTestId("firstname-input"), "Max");
      await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
      await userEvent.click(screen.getByTestId("consent-checkbox"));
      await userEvent.click(screen.getByTestId("submit-button"));
      await waitFor(() => {
         expect(onSubmit).toHaveBeenCalledWith("test@example.com", "Max");
      });
   });

   it("shows loading state when isLoading is true", () => {
      render(<EmailGateStep onSubmit={onSubmit} isLoading={true} />);
      expect(screen.getByTestId("submit-button")).toBeDisabled();
      expect(screen.getByText("Lädt …")).toBeInTheDocument();
   });
});
