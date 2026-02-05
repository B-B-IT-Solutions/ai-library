jest.mock("@/data/actions/user");
jest.mock("sonner");

import { getByTestId, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { updatePassword } from "@/data/actions/user";
import { DUserPasswordUpdate } from "@/data/types/domain/user";

import { UpdatePassword } from "./update-password";

const mokcUpdatePassword = updatePassword as jest.MockedFunction<
   typeof updatePassword
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const updatePassword = screen.getByTestId("update-password");
   const currentPassword = screen.getByTestId("currentPassword");
   const newPassword = screen.getByTestId("newPassword");
   const confirmPassword = screen.getByTestId("confirmPassword");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(updatePassword);
   assertInDocument(currentPassword);
   assertInDocument(newPassword);
   assertInDocument(confirmPassword);
   assertInDocument(submitBtn);
};

const assertPasswordVisible = (field: string) => {
   const passwordField = screen.getByTestId(field);
   const passwordInput = screen.getByTestId(`${field}-input`);
   const icon = getByTestId(passwordField, "eye-off-icon");

   assertHasAttributeWithValue(passwordInput, "type", "text");
   assertInDocument(icon);
};

const assertPasswordNotVisible = (field: string) => {
   const passwordField = screen.getByTestId(field);
   const passwordInput = screen.getByTestId(`${field}-input`);
   const icon = getByTestId(passwordField, "eye-icon");

   assertHasAttributeWithValue(passwordInput, "type", "password");
   assertInDocument(icon);
};

describe("UpdatePassword rendering tests", () => {
   it("UpdatePassword rendered test", async () => {
      const { container } = render(<UpdatePassword />);

      await waitFor(() => {
         assertRendered();
      });
      expect(container).toMatchSnapshot();
   });
});

describe("UpdatePassword functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("UpdatePassword - submit btn clicked - missing data - test", async () => {
      render(<UpdatePassword />);

      await waitFor(() => {
         assertRendered();
         expect(mokcUpdatePassword).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mokcUpdatePassword).not.toHaveBeenCalled();
      });
   });

   it("UpdatePassword - submit btn clicked - success true - test", async () => {
      const result = {
         success: true,
         message: "Password updated",
      };
      mokcUpdatePassword.mockResolvedValue(result);

      render(<UpdatePassword />);

      await waitFor(() => {
         assertRendered();
         expect(mokcUpdatePassword).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mokcUpdatePassword).not.toHaveBeenCalled();
      });

      const currntValue = "123456789";
      const currentPassword = screen.getByTestId("currentPassword-input");
      await userEvent.type(currentPassword, currntValue);

      expect(currentPassword).toHaveValue(currntValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      const newValue = "pwd789456";
      const newPassword = screen.getByTestId("newPassword-input");
      await userEvent.type(newPassword, newValue);

      expect(newPassword).toHaveValue(newValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      const confirmPassword = screen.getByTestId("confirmPassword-input");
      await userEvent.type(confirmPassword, newValue);

      expect(confirmPassword).toHaveValue(newValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      userEvent.click(submitBtn);

      const expectedData: DUserPasswordUpdate = {
         currentPassword: currntValue,
         newPassword: newValue,
         confirmPassword: newValue,
      };

      await waitFor(() => {
         expect(mokcUpdatePassword).toHaveBeenCalledTimes(1);
         expect(mokcUpdatePassword).toHaveBeenCalledWith(expectedData);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/auth/sign-in");
      });
   });

   it("UpdatePassword - submit btn clicked - success false - test", async () => {
      const result = {
         success: false,
         message: "Password couldn't be updated",
      };
      mokcUpdatePassword.mockResolvedValue(result);

      render(<UpdatePassword />);

      await waitFor(() => {
         assertRendered();
         expect(mokcUpdatePassword).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mokcUpdatePassword).not.toHaveBeenCalled();
      });

      const currntValue = "123456";
      const currentPassword = screen.getByTestId("currentPassword-input");
      await userEvent.type(currentPassword, currntValue);

      expect(currentPassword).toHaveValue(currntValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      const newValue = "pwd997899";
      const newPassword = screen.getByTestId("newPassword-input");
      await userEvent.type(newPassword, newValue);

      expect(newPassword).toHaveValue(newValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      const confirmPassword = screen.getByTestId("confirmPassword-input");
      await userEvent.type(confirmPassword, newValue);

      expect(confirmPassword).toHaveValue(newValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      userEvent.click(submitBtn);

      const expectedData: DUserPasswordUpdate = {
         currentPassword: currntValue,
         newPassword: newValue,
         confirmPassword: newValue,
      };

      await waitFor(() => {
         expect(mokcUpdatePassword).toHaveBeenCalledTimes(1);
         expect(mokcUpdatePassword).toHaveBeenCalledWith(expectedData);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });

   it("UpdatePassword - show password btns clicked - test", async () => {
      render(<UpdatePassword />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotVisible("currentPassword");
         assertPasswordNotVisible("newPassword");
         assertPasswordNotVisible("confirmPassword");
         expect(mokcUpdatePassword).not.toHaveBeenCalled();
      });

      const currntValue = "123456789";
      const currentPassword = screen.getByTestId("currentPassword-input");
      await userEvent.type(currentPassword, currntValue);

      expect(currentPassword).toHaveValue(currntValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      const newValue = "pwd789456";
      const newPassword = screen.getByTestId("newPassword-input");
      await userEvent.type(newPassword, newValue);

      expect(newPassword).toHaveValue(newValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      const confirmPassword = screen.getByTestId("confirmPassword-input");
      await userEvent.type(confirmPassword, newValue);

      expect(confirmPassword).toHaveValue(newValue);
      expect(mokcUpdatePassword).not.toHaveBeenCalled();

      const showCurrentBtn = screen.getByTestId(
         "currentPassword-visibility-btn"
      );
      userEvent.click(showCurrentBtn);

      await waitFor(() => {
         assertPasswordVisible("currentPassword");
         assertPasswordNotVisible("newPassword");
         assertPasswordNotVisible("confirmPassword");
      });

      userEvent.click(showCurrentBtn);

      const showNewBtn = screen.getByTestId("newPassword-visibility-btn");
      userEvent.click(showNewBtn);

      await waitFor(() => {
         assertPasswordVisible("newPassword");
         assertPasswordNotVisible("currentPassword");
         assertPasswordNotVisible("confirmPassword");
      });

      userEvent.click(showNewBtn);

      const showConfirmBtn = screen.getByTestId(
         "confirmPassword-visibility-btn"
      );
      userEvent.click(showConfirmBtn);

      await waitFor(() => {
         assertPasswordVisible("confirmPassword");
         assertPasswordNotVisible("currentPassword");
         assertPasswordNotVisible("newPassword");
      });
   });
});
