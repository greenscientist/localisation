import { mortgageMonthlyPayment } from '../mortgage';

describe('mortgage calculations', () => {
    describe('mortgageMonthlyPayment', () => {
        describe('standard Canadian mortgage scenarios', () => {
            it('should calculate monthly payment for $300,000 at 5% over 25 years', () => {
                const principal = 300000;
                const annualRate = 0.05;
                const amortizationMonths = 25 * 12; // 300 months
                const result = mortgageMonthlyPayment(principal, annualRate, amortizationMonths);
                // Expected value verified against Canadian mortgage calculators
                expect(result).toBeCloseTo(1744.82, 0);
            });

            it('should calculate monthly payment for $500,000 at 6% over 25 years', () => {
                const principal = 500000;
                const annualRate = 0.06;
                const amortizationMonths = 25 * 12;
                const result = mortgageMonthlyPayment(principal, annualRate, amortizationMonths);
                // Expected value for Canadian semi-annual compounding
                expect(result).toBeCloseTo(3199.00, 0);
            });

            it('should calculate monthly payment for $400,000 at 4.5% over 30 years', () => {
                const principal = 400000;
                const annualRate = 0.045;
                const amortizationMonths = 30 * 12; // 360 months
                const result = mortgageMonthlyPayment(principal, annualRate, amortizationMonths);
                expect(result).toBeCloseTo(2016.87, 0);
            });

            it('should calculate monthly payment for $250,000 at 3% over 20 years', () => {
                const principal = 250000;
                const annualRate = 0.03;
                const amortizationMonths = 20 * 12; // 240 months
                const result = mortgageMonthlyPayment(principal, annualRate, amortizationMonths);
                expect(result).toBeCloseTo(1384.00, 0);
            });
        });

        describe('different amortization periods', () => {
            const principal = 200000;
            const annualRate = 0.05;

            it('should calculate higher payment for shorter amortization (15 years)', () => {
                const result = mortgageMonthlyPayment(principal, annualRate, 15 * 12);
                expect(result).toBeGreaterThan(1500); //1576
            });

            it('should calculate lower payment for longer amortization (30 years)', () => {
                const result = mortgageMonthlyPayment(principal, annualRate, 30 * 12);
                expect(result).toBeLessThan(1100); //1067
            });

            it('should have shorter amortization result in higher monthly payment', () => {
                const payment15Years = mortgageMonthlyPayment(principal, annualRate, 15 * 12);
                const payment25Years = mortgageMonthlyPayment(principal, annualRate, 25 * 12);
                const payment30Years = mortgageMonthlyPayment(principal, annualRate, 30 * 12);
                expect(payment15Years).toBeGreaterThan(payment25Years);
                expect(payment25Years).toBeGreaterThan(payment30Years);
            });
        });

        describe('different interest rates', () => {
            const principal = 300000;
            const amortizationMonths = 25 * 12;

            it('should calculate lower payment for lower interest rate', () => {
                const paymentAt3 = mortgageMonthlyPayment(principal, 0.03, amortizationMonths);
                const paymentAt5 = mortgageMonthlyPayment(principal, 0.05, amortizationMonths);
                const paymentAt7 = mortgageMonthlyPayment(principal, 0.07, amortizationMonths);
                expect(paymentAt3).toBeLessThan(paymentAt5);
                expect(paymentAt5).toBeLessThan(paymentAt7);
            });

            it('should calculate payment for low rate (2%)', () => {
                const result = mortgageMonthlyPayment(principal, 0.02, amortizationMonths);
                expect(result).toBeGreaterThan(1200);
                expect(result).toBeLessThan(1300);
            });

            it('should calculate payment for high rate (8%)', () => {
                const result = mortgageMonthlyPayment(principal, 0.08, amortizationMonths);
                expect(result).toBeGreaterThan(2200);
                expect(result).toBeLessThan(2300);
            });
        });

        describe('principal scaling', () => {
            const annualRate = 0.05;
            const amortizationMonths = 25 * 12;

            it('should scale linearly with principal', () => {
                const payment100k = mortgageMonthlyPayment(100000, annualRate, amortizationMonths);
                const payment200k = mortgageMonthlyPayment(200000, annualRate, amortizationMonths);
                const payment300k = mortgageMonthlyPayment(300000, annualRate, amortizationMonths);
                expect(payment200k).toBeCloseTo(payment100k * 2, 2);
                expect(payment300k).toBeCloseTo(payment100k * 3, 2);
            });

            it('should handle small principal amounts', () => {
                const result = mortgageMonthlyPayment(50000, annualRate, amortizationMonths);
                expect(result).toBeGreaterThan(0);
                expect(result).toBeLessThan(500);
            });

            it('should handle large principal amounts', () => {
                const result = mortgageMonthlyPayment(10000000, annualRate, amortizationMonths);
                expect(result).toBeGreaterThan(50000);
            });
        });

        describe('edge cases', () => {
            it('should handle very small principal', () => {
                const result = mortgageMonthlyPayment(1000, 0.05, 12);
                expect(result).toBeGreaterThan(0);
                expect(result).toBeCloseTo(85.6, 0);
            });

            it('should handle single month amortization', () => {
                const principal = 10000;
                const annualRate = 0.06;
                const result = mortgageMonthlyPayment(principal, annualRate, 1);
                // For 1 month, payment should be principal + one month of interest
                const monthlyRate = 0.004939;
                const expected = principal * (1 + monthlyRate);
                expect(result).toBeCloseTo(expected, 2);
            });

            it('should handle very long amortization (40 years)', () => {
                const result = mortgageMonthlyPayment(300000, 0.05, 40 * 12);
                expect(result).toBeGreaterThan(0);
                expect(result).toBeLessThan(1500);
            });
        });
    });
});
