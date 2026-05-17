jest.mock("@/components/subscription", () => ({
   TrialExpiredGate: () => {
      return <div data-testid="trial-expired-gate" />;
   },
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
import { cookies, headers } from "next/headers";

import { requireUser } from "@/data/actions/auth-utils";
import {
   getHasActiveAccess,
   getTrialStatus,
} from "@/data/actions/subscription";

import {
   AuthenticatedLayoutWrapper,
   Props,
} from "./layout-wrapper-authenticated";

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
const headersMock = headers as jest.MockedFunction<typeof headers>;
const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;
const getHasActiveAccessMock = getHasActiveAccess as jest.MockedFunction<
   typeof getHasActiveAccess
>;
const getTrialStatusMock = getTrialStatus as jest.MockedFunction<
   typeof getTrialStatus
>;

const assertLayoutRendered = () => {
   const wrapper = screen.getByTestId("authenticated-layout-wrapper");
   const sidebarWrapper = screen.getByTestId("sidebar-wrapper");
   const sidebar = screen.getByTestId("sidebar");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(sidebarWrapper);
   assertInDocument(sidebar);
   assertInDocument(test1);
};

const assertLayoutNotRendered = () => {
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

const asserTrialBannerRendered = () => {
   const banner = screen.getByTestId("trial-banner");
   assertInDocument(banner);
};

const asserTrialBannerNotRendered = () => {
   const banner = screen.queryByTestId("trial-banner");
   assertNotInDocument(banner);
};

const asserTrialExpiredGateRendered = () => {
   const gate = screen.getByTestId("trial-expired-gate");
   assertInDocument(gate);
};

const asserTrialExpiredGateNotRendered = () => {
   const gate = screen.queryByTestId("trial-expired-gate");
   assertNotInDocument(gate);
};

describe("AuthenticatedLayoutWrapper rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("hasAccess true - sidebarCookie undefined - test", async () => {
      const reqCookies = ntestData.cookies({});
      const headers = ntestData.headers({});
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      headersMock.mockResolvedValue(headers);
      requireUserMock.mockResolvedValue(user);

      getHasActiveAccessMock.mockResolvedValue(true);

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
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("hasAccess true - sidebarCookie true - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const headers = ntestData.headers({});
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      headersMock.mockResolvedValue(headers);
      requireUserMock.mockResolvedValue(user);

      getHasActiveAccessMock.mockResolvedValue(true);

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
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("hasAccess true - sidebarCookie false - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "false" });
      const headers = ntestData.headers({});
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      headersMock.mockResolvedValue(headers);
      requireUserMock.mockResolvedValue(user);

      getHasActiveAccessMock.mockResolvedValue(true);

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
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("hasAccess true - trialStatus.isActive true - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const headers = ntestData.headers({ "x-pathname": "/templates" });
      const user = dtestData.dLoginUser();
      const trialStatus = dtestData.dTrialStatus(true, 5);

      cookiesMock.mockResolvedValue(reqCookies);
      headersMock.mockResolvedValue(headers);
      requireUserMock.mockResolvedValue(user);

      getHasActiveAccessMock.mockResolvedValue(true);
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
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("hasAccess true - trialStatus.isActive false - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const headers = ntestData.headers({ "x-pathname": "/templates" });
      const user = dtestData.dLoginUser();
      const trialStatus = dtestData.dTrialStatus(false);

      cookiesMock.mockResolvedValue(reqCookies);
      headersMock.mockResolvedValue(headers);
      requireUserMock.mockResolvedValue(user);

      getHasActiveAccessMock.mockResolvedValue(true);
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
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("hasAccess false - path exempted - test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const headers = ntestData.headers({
         "x-pathname": "/subscription/pricing",
      });
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      headersMock.mockResolvedValue(headers);
      requireUserMock.mockResolvedValue(user);
      getHasActiveAccessMock.mockResolvedValue(false);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertLayoutRendered();
         asserTrialExpiredGateNotRendered();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getHasActiveAccessMock).not.toHaveBeenCalled();
         expect(getTrialStatusMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("hasAccess false - path not exempted- test", async () => {
      const reqCookies = ntestData.cookies({ sidebar_state: "true" });
      const headers = ntestData.headers({ "x-pathname": "/templates" });
      const user = dtestData.dLoginUser();

      cookiesMock.mockResolvedValue(reqCookies);
      headersMock.mockResolvedValue(headers);
      requireUserMock.mockResolvedValue(user);

      getHasActiveAccessMock.mockResolvedValue(false);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertLayoutNotRendered();
         asserTrialExpiredGateRendered();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
         expect(getTrialStatusMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});
