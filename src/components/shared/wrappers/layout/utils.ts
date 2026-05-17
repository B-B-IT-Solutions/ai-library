/**
 * Routes where the paywall gate is suppressed so users can select or pay for a
 * plan even after their trial has expired.
 */
export const PAYWALL_EXEMPT_PATHS = [
   "/subscription/pricing",
   "/subscription/success",
   "/checkout",
];

// Exempt subscription/checkout routes so users can complete payment even after their trial has expired.
export const isPaywallExempt = (pathname: string): boolean => {
   return PAYWALL_EXEMPT_PATHS.some((exempt) => pathname.startsWith(exempt));
};
