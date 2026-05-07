import type {
   EmailVerificationParams,
   PasswordResetEmailParams,
} from "./types";

export interface IEmailService {
   sendVerificationEmail(params: EmailVerificationParams): Promise<void>;

   sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void>;
}
