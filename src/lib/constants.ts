if (!process.env.STRIPE_WEBHOOK_SECRET) {
   throw new Error("STRIPE_WEBHOOK_SECRET is not set in environment variables");
}

if (!process.env.STRIPE_SECRET_KEY) {
   throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "KI Bibliothek";
export const APP_DESCRIPTION =
   process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modernene KI-Bibliothek";
export const APP_URL =
   process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const INIT_PAGE_NUMBER = 0;
export const PAGE_SIZE = 10;
