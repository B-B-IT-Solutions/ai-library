jest.mock("@/data/actions/admin/users");

import { screen, waitFor } from "@testing-library/dom";
import { adtestData, assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAdminUser } from "@/data/actions/admin/users";

import { EditAdminUserPage, metadata, PageParams, PageProps } from "./page";

const getAdminUserMock = getAdminUser as jest.MockedFunction<
   typeof getAdminUser
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Admin – Nutzer Bearbeiten",
};

const assertRendered = () => {
   const page = screen.getByTestId("edit-admin-user-page");
   const editUser = screen.getByTestId("admin-user-edit");

   assertInDocument(page);
   assertInDocument(editUser);
};

describe("EditPromptPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user null - test", async () => {
      getAdminUserMock.mockResolvedValue(null);

      const pageParams: PageParams = { id: "user-id-1" };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const { container } = await renderAsyncRSC(EditAdminUserPage, props);

      await waitFor(() => {
         expect(getAdminUserMock).toHaveBeenCalledTimes(1);
         expect(getAdminUserMock).toHaveBeenCalledWith(pageParams.id);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("user retrieved - test", async () => {
      const user = adtestData.dAdminUser();
      getAdminUserMock.mockResolvedValue(user);

      const pageParams: PageParams = { id: "user-id-1" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const { container } = await renderAsyncRSC(EditAdminUserPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getAdminUserMock).toHaveBeenCalledTimes(1);
         expect(getAdminUserMock).toHaveBeenCalledWith(pageParams.id);
         expect(notFoundMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditAdminUserPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
