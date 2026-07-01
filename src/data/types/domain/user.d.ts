import z from "zod";

import {
   deleteAccountSchema,
   forgotPasswordSchema,
   resetPasswordSchema,
   signInSchema,
   signUpSchema,
   updatePasswordSchema,
   updateProfileSchema,
} from "@/data/types/validators/user";

export type DUserSignIn = z.infer<typeof signInSchema>;

export type DUserSignUp = z.infer<typeof signUpSchema>;

export type DSignUpResult = {
   emailNotVerified: boolean;
};

export type DUserRole = "ADMIN" | "USER" | "PROMO_USER";

export type DUser = {
   id: string;
   name: string;
   email: string;
   role: DUserRole;
   updatedAt: string;
   createdAt: string;
};

export type DUserInternal = DUser & {
   password: string | null;
   stripeCustomerId: string | null;
   emailVerified: Date | null;
   trialEndsAt: Date | null;
};

export type DUserCreate = {
   name: string;
   email: string;
   hashedPassword: string;
   legalNoticesAcceptedAt: Date;
   trialEndsAt: Date;
};

export type DUserUpdate = z.infer<typeof updateProfileSchema>;

export type DUserPasswordUpdate = z.infer<typeof updatePasswordSchema>;

export type DUserAccountDelete = z.infer<typeof deleteAccountSchema>;

export type DVerificationToken = {
   identifier: string;
   token: string;
   expires: Date;
};

export type DResetPasswordToken = {
   identifier: string;
   token: string;
   expires: Date;
};

export type DForgotPassword = z.infer<typeof forgotPasswordSchema>;

export type DResetPassword = z.infer<typeof resetPasswordSchema>;
