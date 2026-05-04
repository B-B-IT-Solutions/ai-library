import type { EmailVerificationParams } from "./types";

export interface IEmailService {
   sendVerificationEmail(params: EmailVerificationParams): Promise<void>;
}
