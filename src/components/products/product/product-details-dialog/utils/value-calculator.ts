import type { BundleValue } from "../types";

export interface BundleValueInput {
   bundlePrice: number;
   individualPrices: number[];
}

/**
 * Calculate bundle savings and value
 */
export const calculateBundleValue = (input: BundleValueInput): BundleValue => {
   const { bundlePrice, individualPrices } = input;

   const totalIndividualPrice = individualPrices.reduce(
      (sum, price) => sum + price,
      0
   );
   const savings = totalIndividualPrice - bundlePrice;
   const savingsPercentage =
      totalIndividualPrice > 0 ? (savings / totalIndividualPrice) * 100 : 0;

   return {
      totalIndividualPrice,
      bundlePrice,
      savings: Math.max(0, savings), // Ensure non-negative
      savingsPercentage: Math.max(0, savingsPercentage), // Ensure non-negative
      itemCount: individualPrices.length,
   };
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
   return price.toFixed(2);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (percentage: number): string => {
   return Math.round(percentage).toString();
};
