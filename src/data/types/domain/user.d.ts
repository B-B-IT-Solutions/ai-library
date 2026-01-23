import z from "zod";

import {
   deleteAccountSchema,
   signInSchema,
   signUpSchema,
   updatePasswordSchema,
   updateProfileSchema,
} from "@/data/types/validators/user";

export type DUserSignIn = z.infer<typeof signInSchema>;

export type DUserSignUp = z.infer<typeof signUpSchema>;

export type DUser = {
   id: string;
   name: string;
   email: string;
   role: string;
   updatedAt: string;
   createdAt: string;
};

export type DUserUpdateData = z.infer<typeof updateProfileSchema>;

export type DUserPasswordUpdate = z.infer<typeof updatePasswordSchema>;

export type DUserAccountDelete = z.infer<typeof deleteAccountSchema>;
