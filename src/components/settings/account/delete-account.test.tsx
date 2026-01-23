jest.mock("@/data/actions/user");
jest.mock("sonner");

import { getByTestId, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";
import { toast } from "sonner";

import { deleteAccount } from "@/data/actions/user";
import { ActionResult } from "@/data/types/utils";

import { DeleteAcount } from "./delete-account";

const mockDeleteAccount = deleteAccount as jest.MockedFunction<
   typeof deleteAccount
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const account = screen.getByTestId("delete-account");
   const deleteBtn = screen.getByTestId("delete-btn");

   assertInDocument(account);
   assertInDocument(deleteBtn);
};

const assertPasswordRendered = () => {
   const password = screen.getByTestId("password");
   assertInDocument(password);
};

const assertPasswordNotRendered = () => {
   const password = screen.queryByTestId("password");
   assertNotInDocument(password);
};

const assertPasswordVisible = () => {
   const passwordField = screen.getByTestId("password");
   const passwordInput = screen.getByTestId("password-input");
   const icon = getByTestId(passwordField, "eye-off-icon");

   assertHasAttributeWithValue(passwordInput, "type", "text");
   assertInDocument(icon);
};

const assertPasswordNotVisible = () => {
   const passwordField = screen.getByTestId("password");
   const passwordInput = screen.getByTestId("password-input");
   const icon = getByTestId(passwordField, "eye-icon");

   assertHasAttributeWithValue(passwordInput, "type", "password");
   assertInDocument(icon);
};

describe("DeleteAcount rendering tests", () => {
   it("DeleteAcount rendered test", async () => {
      const { container } = render(<DeleteAcount />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteAcount functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("DeleteAcount - delete account - success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Account deleted",
      };
      mockDeleteAccount.mockResolvedValue(result);

      render(<DeleteAcount />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const currntValue = "123456789";
      const currentPassword = screen.getByTestId("password-input");
      await userEvent.type(currentPassword, currntValue);

      expect(currentPassword).toHaveValue(currntValue);
      expect(mockDeleteAccount).not.toHaveBeenCalled();

      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mockDeleteAccount).toHaveBeenCalledTimes(1);
         expect(mockDeleteAccount).toHaveBeenCalledWith(currntValue);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
      });
   });

   it("DeleteAcount - delete account - success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Account couldn't be deleted",
      };
      mockDeleteAccount.mockResolvedValue(result);

      render(<DeleteAcount />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const currntValue = "123456789";
      const currentPassword = screen.getByTestId("password-input");
      await userEvent.type(currentPassword, currntValue);

      expect(currentPassword).toHaveValue(currntValue);
      expect(mockDeleteAccount).not.toHaveBeenCalled();

      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mockDeleteAccount).toHaveBeenCalledTimes(1);
         expect(mockDeleteAccount).toHaveBeenCalledWith(currntValue);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });

   it("DeleteAcount - delete account - cancel - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Account couldn't be deleted",
      };
      mockDeleteAccount.mockResolvedValue(result);

      render(<DeleteAcount />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(mockDeleteAccount).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
      });
   });

   it("DeleteAcount - show password btn clicked - test", async () => {
      render(<DeleteAcount />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         assertPasswordNotVisible();
         expect(mockDeleteAccount).not.toHaveBeenCalled();
      });

      const value = "123456789";
      const password = screen.getByTestId("password-input");
      await userEvent.type(password, value);

      expect(password).toHaveValue(value);
      expect(mockDeleteAccount).not.toHaveBeenCalled();

      const showPwdBtn = screen.getByTestId("password-visibility-btn");
      userEvent.click(showPwdBtn);

      await waitFor(() => {
         assertPasswordVisible();
      });

      userEvent.click(showPwdBtn);

      await waitFor(() => {
         assertPasswordNotVisible();
      });
   });
});
