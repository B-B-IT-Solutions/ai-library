jest.mock("@/data/actions/admin/users");

import { screen, waitFor } from "@testing-library/dom";
import { adtestData, assertInDocument, renderAsyncRSC } from "@tests";

import { getAdminUsersPage } from "@/data/actions/admin/users";

import { AdminUsers } from "./admin-users";

const getAdminUsersPageMock = getAdminUsersPage as jest.MockedFunction<
   typeof getAdminUsersPage
>;

const assertRendered = () => {
   const users = screen.getByTestId("admin-users");
   const table = screen.getByTestId("users-table");

   assertInDocument(users);
   assertInDocument(table);
};

describe("AdminUsers rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      const page = adtestData.dAdminUsersPage();
      getAdminUsersPageMock.mockResolvedValue(page);

      const { container } = await renderAsyncRSC(AdminUsers, {});

      await waitFor(() => {
         assertRendered();
         expect(getAdminUsersPageMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
