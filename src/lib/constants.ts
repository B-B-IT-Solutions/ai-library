export const APP_NAME: string =
   process.env.NEXT_PUBLIC_APP_NAME || "Vision Notes";
export const APP_DESCRIPTION: string =
   process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
   "Deine persönliche Bibliothek für KI-Prompts. Erstelle, organisiere und entdecke Prompts für alle gängigen KI-Tools – und hole endlich mehr aus deinen KI-Anwendungen heraus.";
export const APP_URL: string =
   process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const IUBENDA_API_KEY = process.env.IUBENDA_API_KEY;
export const IUBENDA_CONSENT_URL = process.env.IUBENDA_CONSENT_URL;

export const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER;

export const BREVO_API_KEY = process.env.BREVO_API_KEY;
export const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT
   ? parseInt(process.env.SMTP_PORT, 10)
   : undefined;
export const SMTP_FROM = process.env.SMTP_FROM;

// Subscription Plan IDs (set after seeding database)
export const STRIPE_FREE_PLAN_ID = process.env.STRIPE_FREE_PLAN_ID;
export const STRIPE_BASIC_PLAN_ID = process.env.STRIPE_BASIC_PLAN_ID;
export const STRIPE_PRO_PLAN_ID = process.env.STRIPE_PRO_PLAN_ID;

export const INIT_PAGE_NUMBER = 0;
export const PAGE_SIZE = 10;

export const getIubendaApiKey = (): string => {
   if (!IUBENDA_API_KEY) {
      throw new Error("IUBENDA_API_KEY is not set in environment variables");
   }
   return IUBENDA_API_KEY;
};

export const getIubendaConsentUrl = (): string => {
   if (!IUBENDA_CONSENT_URL) {
      throw new Error(
         "IUBENDA_CONSENT_URL is not set in environment variables"
      );
   }
   return IUBENDA_CONSENT_URL;
};

export const getBrevoApiKey = (): string => {
   if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
   }
   return BREVO_API_KEY;
};

export const getBrevoSenderEmail = (): string => {
   if (!BREVO_SENDER_EMAIL) {
      throw new Error("BREVO_SENDER_EMAIL is not set in environment variables");
   }
   return BREVO_SENDER_EMAIL;
};

export const getSmtpHost = (): string => {
   if (!SMTP_HOST) {
      throw new Error("SMTP_HOST is not set in environment variables");
   }
   return SMTP_HOST;
};

export const getSmtpPort = (): number => {
   if (!SMTP_PORT) {
      throw new Error("SMTP_PORT is not set in environment variables");
   }
   return SMTP_PORT;
};

export const getSmtpFrom = (): string => {
   if (!SMTP_FROM) {
      throw new Error("SMTP_FROM is not set in environment variables");
   }
   return SMTP_FROM;
};
