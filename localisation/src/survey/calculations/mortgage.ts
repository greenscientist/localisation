/*
 * Copyright 2025, Polytechnique Montreal and contributors
 *
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 */


// Convert Canadian nominal rate to effective monthly rate
// In Canada, the mortgage interest are compounded every 6 months
function effectiveSemiAnnualMonthlyRate(nominalAnnualRate: number): number {
  // Compounded semi-annually, then converted to monthly
  return Math.pow(1 + nominalAnnualRate / 2, 1 / 6) - 1;
}

// Monthly payment
export function mortgageMonthlyPayment(
  principal: number,
  annualRate: number,
  amortizationMonths: number
): number {
  const i = effectiveSemiAnnualMonthlyRate(annualRate);
  const n = amortizationMonths;
  return principal * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

