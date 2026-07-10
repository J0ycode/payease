/**
 * Safe 2-decimal-place rounding to avoid IEEE-754 float accumulation drift.
 *
 * Problem:  0.1 + 0.2 === 0.30000000000000004  (JavaScript float arithmetic)
 * Solution: Math.round(n * 100) / 100  rounds to exactly 2 dp.
 *
 * Use round2() on every sum/difference of monetary values before storage or comparison.
 *
 * Long-term recommendation: migrate all stored amounts to integer paise (× 100)
 * to eliminate float arithmetic entirely.
 */
const round2 = (n) => Math.round(Number(n) * 100) / 100;

module.exports = { round2 };
