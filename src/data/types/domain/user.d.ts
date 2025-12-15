import z from "zod";

import {
   signInFormSchema,
   signUpFormSchema,
} from "@/data/types/validators/user.schema";

export type DSignInFormData = z.infer<typeof signInFormSchema>;

export type DSignUpFormData = z.infer<typeof signUpFormSchema>;

export type DUserUpdateData = {
   name: string;
};
