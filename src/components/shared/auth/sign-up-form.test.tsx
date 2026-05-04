jest.mock("@/data/actions/user");

import {
   getByDisplayValue,
   getByTestId,
   screen,
   waitFor,
} from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   getElementById,
   renderWithRouter,
} from "@tests";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import mockRouter from "next-router-mock";

import { signUpUser } from "@/data/actions/user";

import { SignUpForm } from "./sign-up-form";

const useSearchParamsMock = useSearchParams as jest.MockedFunction<
   typeof useSearchParams
>;
const signUpUserMock = signUpUser as jest.MockedFunction<typeof signUpUser>;

const assertRendered = () => {
   const form = screen.getByTestId("sign-up-form");
   assertInDocument(form);
};

const assertFieldsRendered = () => {
   assertLegalNoticesLinksRendered();

   const name = screen.getByTestId("name-field");
   const email = screen.getByTestId("email-field");
   const password = screen.getByTestId("password-field");
   const confirmPassword = screen.getByTestId("confirm-password-field");
   const acceptTerms = screen.getByTestId("accept-terms-checkbox");
   const signUpBtn = screen.getByTestId("sign-up-btn");
   const singInLink = screen.getByTestId("sign-in-link");

   assertInDocument(name);
   assertInDocument(email);
   assertInDocument(password);
   assertInDocument(confirmPassword);
   assertInDocument(acceptTerms);
   assertInDocument(signUpBtn);
   assertInDocument(singInLink);
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

const assertCallbackUrl = (url: string) => {
   const callbackUrl = getElementById("callbackUrl");

   assertInDocument(callbackUrl);
   assertHasAttributeWithValue(callbackUrl, "value", url);
};

const assertPasswordVisible = () => {
   const passwordField = screen.getByTestId("password-field");
   const passwordInput = getElementById("password");
   const icon = getByTestId(passwordField, "eye-off-icon");

   assertHasAttributeWithValue(passwordInput, "type", "text");
   assertInDocument(icon);
};

const assertPasswordNotVisible = () => {
   const passwordField = screen.getByTestId("password-field");
   const passwordInput = getElementById("password");
   const icon = getByTestId(passwordField, "eye-icon");

   assertHasAttributeWithValue(passwordInput, "type", "password");
   assertInDocument(icon);
};

const assertConfirmPasswordVisible = () => {
   const passwordField = screen.getByTestId("confirm-password-field");
   const passwordInput = getElementById("confirmPassword");
   const icon = getByTestId(passwordField, "eye-off-icon");

   assertHasAttributeWithValue(passwordInput, "type", "text");
   assertInDocument(icon);
};

const assertConfirmPasswordNotVisible = () => {
   const passwordField = screen.getByTestId("confirm-password-field");
   const passwordInput = getElementById("confirmPassword");
   const icon = getByTestId(passwordField, "eye-icon");

   assertHasAttributeWithValue(passwordInput, "type", "password");
   assertInDocument(icon);
};

describe("SignUpForm rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("callbackUrl defined -  rendered test", async () => {
      const params = { callbackUrl: "callbackUrl/test-1" };
      const searchParams = new URLSearchParams(
         params
      ) as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);

      const { container } = render(<SignUpForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertCallbackUrl(params.callbackUrl);
      });

      expect(container).toMatchSnapshot();
   });

   it("callbackUrl undefined -  rendered test", async () => {
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);

      const { container } = render(<SignUpForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertCallbackUrl("/");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SignUpForm functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("sign in clicked - success true - test", async () => {
      const singUpResult = {
         success: true,
         message: "User registered successfully",
      };

      signUpUserMock.mockResolvedValue(singUpResult);
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);
      render(<SignUpForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         expect(signUpUserMock).not.toHaveBeenCalled();
      });

      const signUpBtn = screen.getByTestId("sign-up-btn");
      await userEvent.click(signUpBtn);

      await waitFor(() => {
         expect(signUpUserMock).not.toHaveBeenCalled();
      });

      const nameValue = "Test 1";
      const name = getElementById("name");
      await userEvent.type(name, nameValue);

      const options = { timeout: 3000 };
      await waitFor(() => {
         const text = screen.getByDisplayValue(nameValue);
         expect(text).toBeInTheDocument();
      }, options);

      const emailValue = "test1@email.com";
      const email = getElementById("email");
      await userEvent.type(email, emailValue);

      await waitFor(() => {
         const text = screen.getByDisplayValue(emailValue);
         expect(text).toBeInTheDocument();
      }, options);

      const passwordValue = "pwd123456";
      const password = getElementById("password");
      await userEvent.type(password, passwordValue);

      await waitFor(() => {
         const text = screen.getByDisplayValue(passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      const confirmPassword = getElementById("confirmPassword");
      await userEvent.type(confirmPassword, passwordValue);

      await waitFor(() => {
         const confirmPasswordField = screen.getByTestId(
            "confirm-password-field"
         );
         const text = getByDisplayValue(confirmPasswordField, passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      const acceptTerms = getElementById("acceptTerms");
      await userEvent.click(acceptTerms);

      userEvent.click(signUpBtn);

      const expectedFormData = {
         name: nameValue,
         email: emailValue,
         password: passwordValue,
         confirmPassword: passwordValue,
         acceptTerms: true,
      };

      await waitFor(() => {
         expect(signUpUserMock).toHaveBeenCalledTimes(1);
         expect(signUpUserMock).toHaveBeenCalledWith(expectedFormData);
      });
   });

   it("sign in clicked - success false - test", async () => {
      const singUpResult = {
         success: false,
         message: "Email already exists",
      };

      signUpUserMock.mockResolvedValue(singUpResult);
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);
      render(<SignUpForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         expect(signUpUserMock).not.toHaveBeenCalled();
      });

      const signUpBtn = screen.getByTestId("sign-up-btn");
      await userEvent.click(signUpBtn);

      await waitFor(() => {
         expect(signUpUserMock).not.toHaveBeenCalled();
      });

      const nameValue = "Test 1";
      const name = getElementById("name");
      await userEvent.type(name, nameValue);

      const options = { timeout: 3000 };
      await waitFor(() => {
         const text = screen.getByDisplayValue(nameValue);
         expect(text).toBeInTheDocument();
      }, options);

      const emailValue = "test1@email.com";
      const email = getElementById("email");
      await userEvent.type(email, emailValue);

      await waitFor(() => {
         const text = screen.getByDisplayValue(emailValue);
         expect(text).toBeInTheDocument();
      }, options);

      const passwordValue = "pwd123456!";
      const password = getElementById("password");
      await userEvent.type(password, passwordValue);

      await waitFor(() => {
         const text = screen.getByDisplayValue(passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      const confirmPassword = getElementById("confirmPassword");
      await userEvent.type(confirmPassword, passwordValue);

      await waitFor(() => {
         const confirmPasswordField = screen.getByTestId(
            "confirm-password-field"
         );
         const text = getByDisplayValue(confirmPasswordField, passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      const acceptTerms = getElementById("acceptTerms");
      await userEvent.click(acceptTerms);

      userEvent.click(signUpBtn);

      const expectedFormData = {
         name: nameValue,
         email: emailValue,
         password: passwordValue,
         confirmPassword: passwordValue,
         acceptTerms: true,
      };

      await waitFor(() => {
         expect(signUpUserMock).toHaveBeenCalledTimes(1);
         expect(signUpUserMock).toHaveBeenCalledWith(expectedFormData);
      });

      const rootError = screen.getByText(singUpResult.message);
      assertInDocument(rootError);
   });

   it("show password btn clicked - test", async () => {
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);
      render(<SignUpForm />);

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

   it("show confirm password btn clicked - test", async () => {
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);
      render(<SignUpForm />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertConfirmPasswordNotVisible();
      });

      const passwordValue = "pwd123";
      const confirmPassword = getElementById("confirmPassword");
      await userEvent.type(confirmPassword, passwordValue);

      const options = { timeout: 3000 };
      await waitFor(() => {
         const text = screen.getByDisplayValue(passwordValue);
         expect(text).toBeInTheDocument();
      }, options);

      const showPasswordBtn = screen.getByTestId(
         "toggle-confirm-password-visibility"
      );
      userEvent.click(showPasswordBtn);

      await waitFor(() => {
         assertConfirmPasswordVisible();
      });

      userEvent.click(showPasswordBtn);

      await waitFor(() => {
         assertConfirmPasswordNotVisible();
      });
   });

   it("sign-in link clicked - test", async () => {
      const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
      useSearchParamsMock.mockReturnValue(searchParams);

      const url = "/auth/sign-in";
      renderWithRouter(<SignUpForm />, url);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
      });

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const singInLink = screen.getByTestId("sign-in-link");
      await userEvent.click(singInLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/auth/sign-in`);
      });
   });
});
