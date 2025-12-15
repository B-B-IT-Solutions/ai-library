import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, ntestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import SignUpPage, { metadata, SignUpPageProps } from "./page";

const authMock = auth as jest.MockedFunction<typeof auth>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

export const expectedMetadata: Metadata = {
   title: "Sign Up",
};

const assertRendered = () => {
   const page = screen.getByTestId("sign-up-page");
   const header = screen.getByTestId("card-header");
   const title = screen.getByTestId("card-title");
   const description = screen.getByTestId("card-description");
   const signUpForm = screen.getByTestId("sign-up-form-mock");

   assertInDocument(page);
   assertInDocument(header);
   assertInDocument(title);
   assertInDocument(description);
   assertInDocument(signUpForm);
};

describe("SignUpPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("SignUpPage - user already signed in - callbackUrl defined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const redirectParams = { callbackUrl: "/callback/test-1" };
      const props: SignUpPageProps = {
         searchParams: Promise.resolve(redirectParams),
      };
      const { container } = await renderAsyncRSC(SignUpPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith(redirectParams.callbackUrl);
      });

      expect(container).toMatchSnapshot();
   });

   it("SignUpPage - user already signed in - callbackUrl undefined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const redirectParams = { callbackUrl: undefined };
      const props: SignUpPageProps = {
         searchParams: Promise.resolve(redirectParams),
      };
      const { container } = await renderAsyncRSC(SignUpPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SignUpPage - user not signed in - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const props: SignUpPageProps = {
         searchParams: Promise.resolve({ callbackUrl: "/callback/test-1" }),
      };
      const { container } = await renderAsyncRSC(SignUpPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SignUpPage functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("SignUpPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
