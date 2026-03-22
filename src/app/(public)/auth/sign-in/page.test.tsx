import { screen, waitFor } from "@testing-library/dom";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   AuthMockedFunction,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import SignInPage, {
   metadata,
   SignInPageProps,
   SignInPageSearchParams,
} from "./page";

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
   const credentialsForm = screen.getByTestId("signin-form-credentails-mock");

   assertInDocument(page);
   assertInDocument(header);
   assertInDocument(title);
   assertInDocument(description);
   assertInDocument(credentialsForm);
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

      const searchParams: SignInPageSearchParams = {
         callbackUrl: "/callback/test-1",
      };
      const props: SignInPageProps = {
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

      const searchParams: SignInPageSearchParams = { callbackUrl: undefined };
      const props: SignInPageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("user not signed in - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const searchParams: SignInPageSearchParams = {
         callbackUrl: "/callback/test-1",
      };
      const props: SignInPageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         assertRendered();
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
