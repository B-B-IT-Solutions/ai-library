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
import { DTrialStatus } from "@/data/types/domain/subscription";

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

const setupMocks = (options?: {
   trialStatus?: DTrialStatus | null;
   pathname?: string;
   sidebarCookie?: string;
}) => {
   const {
      trialStatus = null,
      pathname = "/templates",
      sidebarCookie,
   } = options ?? {};

   const cookieValues: Record<string, string> = {};
   if (sidebarCookie !== undefined) {
      cookieValues["sidebar_state"] = sidebarCookie;
   }

   cookiesMock.mockResolvedValue(ntestData.cookies(cookieValues));
   headersMock.mockResolvedValue(ntestData.headers({ "x-pathname": pathname }));
   requireUserMock.mockResolvedValue(dtestData.dLoginUser());

   getTrialStatusMock.mockResolvedValue(trialStatus ?? null);
};

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
      jest.resetAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("sidebarCookie undefined - user has access - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(true);
      setupMocks();

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
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("sidebarCookie true - user has access - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(true);

      setupMocks({ sidebarCookie: "true" });

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
      });

      expect(container).toMatchSnapshot();
   });

   it("sidebarCookie false - user has access - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(true);

      setupMocks({ sidebarCookie: "false" });

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
      });

      expect(container).toMatchSnapshot();
   });

   it("trial active - renders TrialBanner with correct daysLeft - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(true);

      const trialStatus: DTrialStatus = {
         isActive: true,
         daysLeft: 5,
         endsAt: new Date(Date.now() + 5 * 86400000),
      };
      setupMocks({ trialStatus });

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         asserTrialBannerRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("trial not active - TrialBanner not rendered - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(true);

      const trialStatus: DTrialStatus = {
         isActive: false,
         daysLeft: 0,
         endsAt: null,
      };
      setupMocks({ trialStatus });

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         asserTrialBannerNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("no access - renders TrialExpiredGate instead of content - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(false);

      setupMocks();

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         asserTrialExpiredGateRendered();
         assertNotInDocument(
            screen.queryByTestId("authenticated-layout-wrapper")
         );
         assertNotInDocument(screen.queryByTestId("test-1"));
         expect(getHasActiveAccessMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("no access but exempt path /subscription/pricing - renders content - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(false);

      setupMocks({ pathname: "/subscription/pricing" });

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         asserTrialExpiredGateNotRendered();
         expect(getHasActiveAccessMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("no access but exempt path /checkout - renders content - test", async () => {
      getHasActiveAccessMock.mockResolvedValue(false);
      setupMocks({ pathname: "/checkout" });

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         asserTrialExpiredGateNotRendered();
         expect(getHasActiveAccessMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});
