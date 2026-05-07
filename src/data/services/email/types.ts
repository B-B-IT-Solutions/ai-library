export type EmailVerificationParams = {
   to: string;
   name: string;
   verificationUrl: string;
};

export type PasswordResetEmailParams = {
   to: string;
   name: string;
   resetUrl: string;
};
