jest.mock("@/data/actions/auth-utils");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   ctestData,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isAuthenticated, requireUser } from "@/data/actions/auth-utils";

import {
   AuthenticatedLayoutWrapper,
   Props,
} from "./layout-wrapper-authenticated";

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const isAuthenticatedMock = isAuthenticated as jest.MockedFunction<
   typeof isAuthenticated
>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const assertRendered = () => {
   const wrapper = screen.getByTestId("authenticated-layout-wrapper");
   const sidebarWrapper = screen.getByTestId("sidebar-wrapper");
   const sidebar = screen.getByTestId("sidebar");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(sidebarWrapper);
   assertInDocument(sidebar);
   assertInDocument(test1);
};

const assertNotRendered = () => {
   const wrapper = screen.queryByTestId("authenticated-layout-wrapper");
   const sidebarWrapper = screen.queryByTestId("sidebar-wrapper");
   const sidebar = screen.queryByTestId("sidebar");
   const test1 = screen.queryByTestId("test-1");

   assertNotInDocument(wrapper);
   assertNotInDocument(sidebarWrapper);
   assertNotInDocument(sidebar);
   assertNotInDocument(test1);
};

const assertSidebarExpanded = () => {
   const sidebarWrapper = screen.getByTestId("sidebar-wrapper");
   const firstChild = sidebarWrapper.firstChild as HTMLElement;
   assertHasAttributeWithValue(firstChild, "data-state", "expanded");
};

const assertSidebarCollapsed = () => {
   const sidebarWrapper = screen.getByTestId("sidebar-wrapper");
   const firstChild = sidebarWrapper.firstChild as HTMLElement;
   assertHasAttributeWithValue(firstChild, "data-state", "collapsed");
};

describe("AuthenticatedLayoutWrapper rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("isAuthenticated false - test", async () => {
      isAuthenticatedMock.mockResolvedValue(false);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertNotRendered();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in");
         expect(cookiesMock).not.toHaveBeenCalled();
         expect(requireUserMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated true - sidebarCookie undefined - test", async () => {
      isAuthenticatedMock.mockResolvedValue(true);
      const reqCookies = ntestData.cookies({});
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      requireUserMock.mockResolvedValue(user);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         assertSidebarExpanded();
         expect(redirectMock).not.toHaveBeenCalled();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated true - sidebarCookie true - test", async () => {
      isAuthenticatedMock.mockResolvedValue(true);
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      requireUserMock.mockResolvedValue(user);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         assertSidebarExpanded();
         expect(redirectMock).not.toHaveBeenCalled();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated true - sidebarCookie false - test", async () => {
      isAuthenticatedMock.mockResolvedValue(true);
      const reqCookies = ntestData.cookies({ sidebar_state: "false" });
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      requireUserMock.mockResolvedValue(user);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         assertSidebarCollapsed();
         expect(redirectMock).not.toHaveBeenCalled();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
