jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   getElementById,
} from "@tests";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { signInWithCredentials } from "@/data/actions/user";

import { CredentialsSignInForm } from "./sign-in-form-credentials";

const useSearchParamsMock = useSearchParams as jest.MockedFunction<
   typeof useSearchParams
>;
const signInWithCredentialsMock = signInWithCredentials as jest.MockedFunction<
   typeof signInWithCredentials
>;

const assertRendered = () => {
   const form = screen.getByTestId("singin-form-credentails");
   assertInDocument(form);
};

const assertFieldsRendered = () => {
   const email = screen.getByTestId("email-field");
   const password = screen.getByTestId("password-field");
   const signInBtn = screen.getByTestId("sign-in-btn");
   const singUpLink = screen.getByTestId("sign-up-link");
   const forgotPasswordLink = screen.getByTestId("forgot-password-link");

   assertInDocument(email);
   assertInDocument(password);
   assertInDocument(signInBtn);
   assertInDocument(singUpLink);
   assertInDocument(forgotPasswordLink);
};

const assertCallbackUrl = (url: string) => {
   const callbackUrl = getElementById("callbackUrl");

   assertInDocument(callbackUrl);
   assertHasAttributeWithValue(callbackUrl, "value", url);
};

const assertPasswordVisible = () => {
   const password = getElementById("password");
   const icon = screen.getByTestId("eye-off-icon");

   assertHasAttributeWithValue(password, "type", "text");
   assertInDocument(icon);
};

const assertPasswordNotVisible = () => {
   const password = getElementById("password");
   const icon = screen.getByTestId("eye-icon");

   assertHasAttributeWithValue(password, "type", "password");
   assertInDocument(icon);
};

describe("CredentialsSignInForm rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CredentialsSignInForm - callbackUrl defined -  rendered test", async () => {
      const params = { callbackUrl: "callbackUrl/test-1" };
      const searchParams = new URLSearchParams(
         params
      ) as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);

      const { container } = render(<CredentialsSignInForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertCallbackUrl(params.callbackUrl);
      });

      expect(container).toMatchSnapshot();
   });

   it("CredentialsSignInForm - callbackUrl undefined -  rendered test", async () => {
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);

      const { container } = render(<CredentialsSignInForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertCallbackUrl("/");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CredentialsSignInForm functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CredentialsSignInForm - sign in clicked - success true - test", async () => {
      const singInResult = {
         success: true,
         message: "Signed in successfully",
      };
      signInWithCredentialsMock.mockResolvedValue(singInResult);
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);
      render(<CredentialsSignInForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         expect(signInWithCredentialsMock).not.toHaveBeenCalled();
      });

      const signInBtn = screen.getByTestId("sign-in-btn");
      await userEvent.click(signInBtn);

      await waitFor(() => {
         expect(signInWithCredentialsMock).not.toHaveBeenCalled();
      });

      const emailValue = "test1@email.com";
      const email = getElementById("email");
      await userEvent.type(email, emailValue);

      const options = { timeout: 3000 };
      await waitFor(() => {
         const text = screen.getByDisplayValue(emailValue);
         expect(text).toBeInTheDocument();
      }, options);

      const passwordValue = "pwd123";
      const password = getElementById("password");
      await userEvent.type(password, passwordValue);

      await waitFor(() => {
         const text = screen.getByDisplayValue(passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      userEvent.click(signInBtn);

      const expectedFormData = {
         email: emailValue,
         password: passwordValue,
      };

      await waitFor(() => {
         expect(signInWithCredentialsMock).toHaveBeenCalledTimes(1);
         expect(signInWithCredentialsMock).toHaveBeenCalledWith(
            expectedFormData
         );
      });
   });

   it("CredentialsSignInForm - sign in clicked - success false - test", async () => {
      const singInResult = {
         success: false,
         message: "Invalid email or password",
      };
      signInWithCredentialsMock.mockResolvedValue(singInResult);
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);
      render(<CredentialsSignInForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         expect(signInWithCredentialsMock).not.toHaveBeenCalled();
      });

      const signInBtn = screen.getByTestId("sign-in-btn");
      await userEvent.click(signInBtn);

      await waitFor(() => {
         expect(signInWithCredentialsMock).not.toHaveBeenCalled();
      });

      const emailValue = "test1@email.com";
      const email = getElementById("email");
      await userEvent.type(email, emailValue);

      const options = { timeout: 3000 };
      await waitFor(() => {
         const text = screen.getByDisplayValue(emailValue);
         expect(text).toBeInTheDocument();
      }, options);

      const passwordValue = "pwd123";
      const password = getElementById("password");
      await userEvent.type(password, passwordValue);

      await waitFor(() => {
         const text = screen.getByDisplayValue(passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      userEvent.click(signInBtn);

      const expectedFormData = {
         email: emailValue,
         password: passwordValue,
      };

      await waitFor(() => {
         expect(signInWithCredentialsMock).toHaveBeenCalledTimes(1);
         expect(signInWithCredentialsMock).toHaveBeenCalledWith(
            expectedFormData
         );
      });

      const rootError = screen.getByText(singInResult.message);
      assertInDocument(rootError);
   });

   it("CredentialsSignInForm - show password toggle clicked - test", async () => {
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);
      render(<CredentialsSignInForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertPasswordNotVisible();
      });

      const passwordValue = "pwd123";
      const password = getElementById("password");
      await userEvent.type(password, passwordValue);

      const options = { timeout: 3000 };
      await waitFor(() => {
         const text = screen.getByDisplayValue(passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      const showPasswordBtn = screen.getByTestId("toggle-password-visibility");
      userEvent.click(showPasswordBtn);

      await waitFor(() => {
         assertPasswordVisible();
      });

      userEvent.click(showPasswordBtn);

      await waitFor(() => {
         assertPasswordNotVisible();
      });
   });
});
