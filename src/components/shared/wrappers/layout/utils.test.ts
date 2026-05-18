import { forEach } from "es-toolkit/compat";

import { isPaywallExempt, PAYWALL_EXEMPT_PATHS } from "./utils";

const expectedPaywalExemptPaths = [
   "/subscription/pricing",
   "/subscription/success",
   "/checkout",
   "/settings/general",
   "/settings/subscription",
];

describe("utils tests", () => {
   it(" PAYWALL_EXEMPT_PATHS - test", async () => {
      expect(PAYWALL_EXEMPT_PATHS).toEqual(expectedPaywalExemptPaths);
   });

   it(" isPaywallExempt - test", async () => {
      const result1 = isPaywallExempt("/prompts");
      expect(result1).toEqual(false);

      const result2 = isPaywallExempt("/prompts/prompt-123");
      expect(result2).toEqual(false);

      const result3 = isPaywallExempt("/collections");
      expect(result3).toEqual(false);

      forEach(expectedPaywalExemptPaths, (p) => {
         const result = isPaywallExempt(p);
         expect(result).toEqual(true);
      });
   });
});
