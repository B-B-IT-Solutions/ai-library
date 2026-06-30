jest.mock("@/data/actions/admin/users");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adtestData, assertInDocument } from "@tests";
import { toast } from "sonner";

import { updateUserRole } from "@/data/actions/admin/users";
import { ActionResult } from "@/data/types/utils";

import { UserRoleForm } from "./user-role-form";

const updateUserRoleMock = updateUserRole as jest.MockedFunction<
   typeof updateUserRole
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("user-role-form");
   const role = screen.getByTestId("role-trigger");
   const saveBtn = screen.getByTestId("save-btn");

   assertInDocument(form);
   assertInDocument(role);
   assertInDocument(saveBtn);
};

describe("UserRoleForm rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("role user - test", async () => {
      const user = adtestData.dAdminUser();
      user.role = "user";

      const { container } = render(<UserRoleForm user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   test("role admin - test", async () => {
      const user = adtestData.dAdminUser();
      user.role = "admin";

      const { container } = render(<UserRoleForm user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UserRoleForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("submit - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Rolle erfolgreich aktualisiert.",
      };
      updateUserRoleMock.mockResolvedValue(result);

      const user = adtestData.dAdminUser();
      user.role = "user";

      render(<UserRoleForm user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(updateUserRoleMock).toHaveBeenCalledTimes(1);
         expect(updateUserRoleMock).toHaveBeenCalledWith(user.id, "user");
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
      });
   });

   test("submit - error - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      updateUserRoleMock.mockResolvedValue(result);

      const user = adtestData.dAdminUser();
      user.role = "admin";

      render(<UserRoleForm user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(updateUserRoleMock).toHaveBeenCalledTimes(1);
         expect(updateUserRoleMock).toHaveBeenCalledWith(user.id, "admin");
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });
});
