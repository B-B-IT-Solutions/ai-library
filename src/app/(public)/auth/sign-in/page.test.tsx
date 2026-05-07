jest.mock("@/components/shared/auth", () => ({
   CredentialsSignInForm: () => {
      return <div data-testid="signin-form-credentails" />;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   AuthMockedFunction,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { metadata, PageProps, PageSearchParams, SignInPage } from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Anmelden",
};

const assertRendered = () => {
   const page = screen.getByTestId("sign-in-page");
   const header = screen.getByTestId("card-header");
   const title = screen.getByTestId("card-title");
   const description = screen.getByTestId("card-description");
   const credentialsForm = screen.getByTestId("signin-form-credentails");

   assertInDocument(page);
   assertInDocument(header);
   assertInDocument(title);
   assertInDocument(description);
   assertInDocument(credentialsForm);
};

const assertPasswordResetBannerRendered = () => {
   const passwordReset = screen.getByTestId("password-reset-banner");
   const verified = screen.queryByTestId("verified-banner");
   const error = screen.queryByTestId("error-banner");

   assertInDocument(passwordReset);
   assertNotInDocument(verified);
   assertNotInDocument(error);
};

const assertVerifiedBannerRendered = () => {
   const verified = screen.getByTestId("verified-banner");
   const passwordReset = screen.queryByTestId("password-reset-banner");
   const error = screen.queryByTestId("error-banner");

   assertInDocument(verified);
   assertNotInDocument(passwordReset);
   assertNotInDocument(error);
};

const assertErrorBannerRendered = () => {
   const error = screen.getByTestId("error-banner");
   const passwordReset = screen.queryByTestId("password-reset-banner");
   const verified = screen.queryByTestId("verified-banner");

   assertInDocument(error);
   assertNotInDocument(passwordReset);
   assertNotInDocument(verified);
};

const assertLegalNoticesLinksRendered = () => {
   const termsLink = screen.getByTestId("terms_conditions_link");
   const privacyPolicyLink = screen.getByTestId("privacy_policy_link");

   assertInDocument(termsLink);
   assertHasAttributeWithValue(
      termsLink,
      "href",
      "https://www.iubenda.com/terms-and-conditions/97062585"
   );
   assertInDocument(privacyPolicyLink);
   assertHasAttributeWithValue(
      privacyPolicyLink,
      "href",
      "https://www.iubenda.com/privacy-policy/97062585/full-legal"
   );
};

describe("SignInPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("user already signed in - callbackUrl defined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const searchParams: PageSearchParams = {
         callbackUrl: "/callback/test-1",
      };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith(searchParams.callbackUrl);
      });

      expect(container).toMatchSnapshot();
   });

   it("user already signed in - callbackUrl undefined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const searchParams: PageSearchParams = { callbackUrl: undefined };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("user not signed in - without searchParams - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const searchParams: PageSearchParams = {
         callbackUrl: "/callback/test-1",
      };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         assertRendered();
         assertLegalNoticesLinksRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("user not signed in - searchParams - password_reset true - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const searchParams: PageSearchParams = {
         callbackUrl: "/callback/test-1",
         password_reset: "true",
      };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         assertRendered();
         assertPasswordResetBannerRendered();
         assertLegalNoticesLinksRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("user not signed in - searchParams - verified true - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const searchParams: PageSearchParams = {
         callbackUrl: "/callback/test-1",
         verified: "true",
      };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         assertRendered();
         assertVerifiedBannerRendered();
         assertLegalNoticesLinksRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("user not signed in - searchParams - error expired_link - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const searchParams: PageSearchParams = {
         callbackUrl: "/callback/test-1",
         error: "expired_link",
      };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         assertRendered();
         assertErrorBannerRendered();
         assertLegalNoticesLinksRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SignInPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
