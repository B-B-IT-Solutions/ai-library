jest.mock("@/data/actions/user");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { toast } from "sonner";

import { updatePassword } from "@/data/actions/user";

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
   it("UpdatePassword - submit failed - missing data - test", async () => {
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
});
