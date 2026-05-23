jest.mock("@/data/actions/user");
jest.mock("sonner");

import { getByTestId, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   dtestData,
} from "@tests";
import { toast } from "sonner";

import { deleteUser } from "@/data/actions/user";
import { DSubscription } from "@/data/types/domain/subscription";
import { DUserAccountDelete } from "@/data/types/domain/user";
import { ActionResult } from "@/data/types/utils";

import { DeleteAcount } from "./delete-account";

const deleteUserMock = deleteUser as jest.MockedFunction<typeof deleteUser>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const account = screen.getByTestId("delete-account");
   const deleteBtn = screen.getByTestId("delete-btn");

   assertInDocument(account);
   assertInDocument(deleteBtn);
};

const assertBlockedRendered = () => {
   const account = screen.getByTestId("delete-account");
   const notice = screen.getByTestId("delete-blocked-notice");

   assertInDocument(account);
   assertInDocument(notice);
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
   it("DeleteAcount rendered - no subscription - test", async () => {
      const { container } = render(<DeleteAcount subscription={null} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("DeleteAcount rendered - subscription CANCELED - test", async () => {
      const subscription: DSubscription = {
         ...dtestData.dSubscription(),
         status: "CANCELED",
      };
      const { container } = render(<DeleteAcount subscription={subscription} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("DeleteAcount rendered - subscription ACTIVE - shows blocked notice - test", async () => {
      const subscription: DSubscription = {
         ...dtestData.dSubscription(),
         status: "ACTIVE",
      };
      const { container } = render(<DeleteAcount subscription={subscription} />);

      await waitFor(() => {
         assertBlockedRendered();
         expect(screen.queryByTestId("delete-btn")).not.toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
   });

   it.each(["INCOMPLETE", "PAST_DUE", "UNPAID", "TRIALING", "PAUSED"] as const)(
      "DeleteAcount rendered - subscription %s - shows blocked notice - test",
      async (status) => {
         const subscription: DSubscription = {
            ...dtestData.dSubscription(),
            status,
         };

         render(<DeleteAcount subscription={subscription} />);

         await waitFor(() => {
            assertBlockedRendered();
            expect(screen.queryByTestId("delete-btn")).not.toBeInTheDocument();
         });
      }
   );
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
      deleteUserMock.mockResolvedValue(result);

      render(<DeleteAcount subscription={null} />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const value = "123456789";
      const currentPassword = screen.getByTestId("password-input");
      await userEvent.type(currentPassword, value);

      expect(currentPassword).toHaveValue(value);
      expect(deleteUserMock).not.toHaveBeenCalled();

      await userEvent.click(submitBtn);

      const expectedPayload: DUserAccountDelete = {
         password: value,
      };

      await waitFor(() => {
         expect(deleteUserMock).toHaveBeenCalledTimes(1);
         expect(deleteUserMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
      });
   });

   it("DeleteAcount - delete account - success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Account couldn't be deleted",
      };
      deleteUserMock.mockResolvedValue(result);

      render(<DeleteAcount subscription={null} />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const value = "123456789";
      const currentPassword = screen.getByTestId("password-input");
      await userEvent.type(currentPassword, value);

      expect(currentPassword).toHaveValue(value);
      expect(deleteUserMock).not.toHaveBeenCalled();

      await userEvent.click(submitBtn);

      const expectedPayload: DUserAccountDelete = {
         password: value,
      };

      await waitFor(() => {
         expect(deleteUserMock).toHaveBeenCalledTimes(1);
         expect(deleteUserMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });

   it("DeleteAcount - delete account - cancel - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Account couldn't be deleted",
      };
      deleteUserMock.mockResolvedValue(result);

      render(<DeleteAcount subscription={null} />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deleteUserMock).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
      });
   });

   it("DeleteAcount - show password btn clicked - test", async () => {
      render(<DeleteAcount subscription={null} />);

      await waitFor(() => {
         assertRendered();
         assertPasswordNotRendered();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertPasswordRendered();
         assertPasswordNotVisible();
         expect(deleteUserMock).not.toHaveBeenCalled();
      });

      const value = "123456789";
      const password = screen.getByTestId("password-input");
      await userEvent.type(password, value);

      expect(password).toHaveValue(value);
      expect(deleteUserMock).not.toHaveBeenCalled();

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

   it("DeleteAcount - blocked - does not call deleteUser - test", async () => {
      const subscription: DSubscription = {
         ...dtestData.dSubscription(),
         status: "ACTIVE",
      };

      render(<DeleteAcount subscription={subscription} />);

      await waitFor(() => {
         assertBlockedRendered();
      });

      expect(deleteUserMock).not.toHaveBeenCalled();
   });
});
