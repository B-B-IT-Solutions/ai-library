import z from "zod";

import {
   signInSchema,
   signUpSchema,
} from "@/data/types/validators/user.schema";

export type DUserSignIn = z.infer<typeof signInSchema>;

export type DUserSignUp = z.infer<typeof signUpSchema>;

export type DUserUpdateData = {
   name: string;
};

export type DUser = {
   id: string;
   name: string;
   email: string;
   role: string;
   updatedAt: string;
   createdAt: string;
};
