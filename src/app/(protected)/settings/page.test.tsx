jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertInDocument,
   AuthMockedFunction,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserById } from "@/data/actions/user";

import SettingsPage, { metadata } from "./page";

const authMock = auth as unknown as AuthMockedFunction;

const getUserByIdMock = getUserById as jest.MockedFunction<typeof getUserById>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

export const expectedMetadata: Metadata = {
   title: "Einstellungen",
};

const assertRendered = () => {
   const page = screen.getByTestId("settings-page");
   const settings = screen.getByTestId("settings-view");

   assertInDocument(page);
   assertInDocument(settings);
};

describe("SettingsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SettingsPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getUserByIdMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SettingsPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getUserByIdMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SettingsPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getUserByIdMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SettingsPage - user retrieved - test", async () => {
      const session = ntestData.session();
      const user = dtestData.dUser();
      authMock.mockResolvedValue(session);
      getUserByIdMock.mockResolvedValue(user);

      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         assertRendered();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getUserByIdMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SettingsPage functionality tests", () => {
   it("SettingsPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
