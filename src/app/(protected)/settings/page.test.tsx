import { waitFor } from "@testing-library/dom";
import { AuthMockedFunction, ntestData, renderAsyncRSC } from "@tests";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import SettingsPage from "./page";

const authMock = auth as unknown as AuthMockedFunction;

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

describe("SettingsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SettingsPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
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
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SettingsPage - user retrieved - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(SettingsPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/settings/general");
      });

      expect(container).toMatchSnapshot();
   });
});
