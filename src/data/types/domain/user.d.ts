import z from "zod";

import {
   signInFormSchema,
   signUpFormSchema,
} from "@/data/types/validators/user.schema";

export type DUserSignIn = z.infer<typeof signInFormSchema>;

export type DUserSignUp = z.infer<typeof signUpFormSchema>;

export type DUserUpdateData = {
   name: string;
};
