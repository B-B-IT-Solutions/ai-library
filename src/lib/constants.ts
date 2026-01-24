export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "KI Bibliothek";
export const APP_DESCRIPTION =
   process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modernene KI-Bibliothek";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Subscription Plan IDs (set after seeding database)
export const STRIPE_FREE_PLAN_ID = process.env.STRIPE_FREE_PLAN_ID;
export const STRIPE_BASIC_PLAN_ID = process.env.STRIPE_BASIC_PLAN_ID;
export const STRIPE_PRO_PLAN_ID = process.env.STRIPE_PRO_PLAN_ID;

export const INIT_PAGE_NUMBER = 0;
export const PAGE_SIZE = 10;
