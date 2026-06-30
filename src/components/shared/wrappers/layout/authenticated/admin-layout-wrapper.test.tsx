jest.mock("@/data/actions/auth-utils");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   ctestData,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { cookies } from "next/headers";

import { requireAdmin } from "@/data/actions/auth-utils";

import { AuthenticatedAdminLayoutWrapper, Props } from "./admin-layout-wrapper";

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
const requireAdminMock = requireAdmin as jest.MockedFunction<
   typeof requireAdmin
>;

const assertLayoutRendered = () => {
   const wrapper = screen.getByTestId("authenticated-admin-layout-wrapper");
   const sidebarWrapper = screen.getByTestId("sidebar-wrapper");
   const sidebar = screen.getByTestId("admin-sidebar");
   const mobileHeader = screen.getByTestId("sidebar-mobile-header");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(sidebarWrapper);
   assertInDocument(sidebar);
   assertInDocument(mobileHeader);
   assertInDocument(test1);
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

describe("AuthenticatedAdminLayoutWrapper rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("sidebarCookie undefined - test", async () => {
      const reqCookies = ntestData.cookies({});
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      requireAdminMock.mockResolvedValue(user);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedAdminLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertLayoutRendered();
         assertSidebarExpanded();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireAdminMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("sidebarCookie true - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      requireAdminMock.mockResolvedValue(user);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedAdminLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertLayoutRendered();
         assertSidebarExpanded();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireAdminMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("sidebarCookie false - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "false" });
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      requireAdminMock.mockResolvedValue(user);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedAdminLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertLayoutRendered();
         assertSidebarCollapsed();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireAdminMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
