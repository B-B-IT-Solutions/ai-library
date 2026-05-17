/**
 * Routes where the paywall gate is suppressed so users can select or pay for a
 * plan even after their trial has expired.
 */
export const PAYWALL_EXEMPT_PATHS = [
   "/subscription/pricing",
   "/subscription/success",
   "/checkout",
];

export const isPaywallExempt = (pathname: string): boolean => {
   return PAYWALL_EXEMPT_PATHS.some((path) => pathname.startsWith(path));
};
