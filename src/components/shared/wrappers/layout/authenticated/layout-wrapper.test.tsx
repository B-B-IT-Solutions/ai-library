jest.mock("@/components/subscription", () => ({
   TrialBanner: () => {
      return <div data-testid="trial-banner" />;
   },
}));

jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/actions/subscription");

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

import { requireUser } from "@/data/actions/auth-utils";
import { getTrialStatus } from "@/data/actions/subscription";

import { AuthenticatedLayoutWrapper, Props } from "./layout-wrapper";

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;
const getTrialStatusMock = getTrialStatus as jest.MockedFunction<
   typeof getTrialStatus
>;

const assertLayoutRendered = () => {
   const wrapper = screen.getByTestId("authenticated-layout-wrapper");
   const sidebarWrapper = screen.getByTestId("sidebar-wrapper");
   const sidebar = screen.getByTestId("sidebar");
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

const asserTrialBannerRendered = () => {
   const banner = screen.getByTestId("trial-banner");
   assertInDocument(banner);
};

const asserTrialBannerNotRendered = () => {
   const banner = screen.queryByTestId("trial-banner");
   assertNotInDocument(banner);
};

describe("AuthenticatedLayoutWrapper rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("sidebarCookie undefined - test", async () => {
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
         assertLayoutRendered();
         assertSidebarExpanded();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("sidebarCookie true - test", async () => {
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
         assertLayoutRendered();
         assertSidebarExpanded();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("sidebarCookie false - test", async () => {
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
         assertLayoutRendered();
         assertSidebarCollapsed();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("trialStatus.isActive true - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const user = dtestData.dLoginUser();
      const trialStatus = dtestData.dTrialStatus(true, 5);

      cookiesMock.mockResolvedValue(reqCookies);
      requireUserMock.mockResolvedValue(user);
      getTrialStatusMock.mockResolvedValue(trialStatus);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertLayoutRendered();
         asserTrialBannerRendered();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("trialStatus.isActive false - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const user = dtestData.dLoginUser();
      const trialStatus = dtestData.dTrialStatus(false);

      cookiesMock.mockResolvedValue(reqCookies);
      requireUserMock.mockResolvedValue(user);
      getTrialStatusMock.mockResolvedValue(trialStatus);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertLayoutRendered();
         asserTrialBannerNotRendered();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
