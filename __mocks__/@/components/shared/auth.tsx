import { FC } from "react";

const CredentialsSignInForm: FC = () => {
   return <div data-testid="signin-form-credentails-mock" />;
};

const SignUpForm: FC = () => {
   return <div data-testid="sign-up-form-mock" />;
};

const ForgotPasswordForm: FC = () => {
   return <div data-testid="forgot-password-form-mock" />;
};

const ResetPasswordForm: FC = () => {
   return <div data-testid="reset-password-form-mock" />;
};

module.exports = {
   __esModule: true,
   CredentialsSignInForm,
   SignUpForm,
   ForgotPasswordForm,
   ResetPasswordForm,
};
