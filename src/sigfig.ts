/**
 * Utilities for counting and formatting significant figures
 */

import Big from "big.js";
import { digitsAfterDecimal } from "./formatting.js";

/**
 * Validates that a sigfigs parameter is a positive integer
 * @param sigfigs - The value to validate
 * @throws Error if sigfigs is not a positive integer
 * @internal
 */
export function validateSigfigs(sigfigs: number): void {
  if (!Number.isInteger(sigfigs) || sigfigs <= 0) {
    throw new Error("Number of significant figures must be a positive integer");
  }
}

/**
 * Counts the number of significant figures in a number
 *
 * The fundamental rules that determine this are straightforward:
 * 1. All non-zero digits are always significant
 * 2. Zeros between non-zero digits are significant
 * 3. Leading zeros (before the first non-zero digit) are never significant
 * 4. Trailing zeros after a decimal point are significant
 * 5. Trailing zeros in a whole number without a decimal point are not significant
 * 6. In scientific notation, all digits in the coefficient are significant
 *
 * @param value - The number to analyze (can be number, string, or integer)
 * @returns The number of significant figures
 *
 * @example
 * ```typescript
 * sigfigOf(123)        // 3 - all non-zero digits
 * sigfigOf(1.23)       // 3 - all non-zero digits
 * sigfigOf(120)        // 2 - trailing zero in whole number not significant
 * sigfigOf(120.0)      // 4 - trailing zeros after decimal are significant
 * sigfigOf(0.00123)    // 3 - leading zeros not significant
 * sigfigOf(1.230)      // 4 - trailing zero after decimal is significant
 * sigfigOf(102)        // 3 - zero between non-zero digits is significant
 * sigfigOf("1.23e-4")  // 3 - scientific notation coefficient
 * ```
 */
export function sigfigOf(value: number | string): number {
  // Convert to string for analysis
  let str = typeof value === "string" ? value.trim() : String(value);

  // Handle empty or invalid input
  if (!str || str === "0") return 1;

  // Handle scientific notation (e.g., "1.23e-4", "2.5E+3")
  const scientificMatch = str.match(/^([+-]?)(\d*\.?\d+)[eE]([+-]?\d+)$/i);
  if (scientificMatch) {
    const coefficient = scientificMatch[2];
    return sigfigOf(coefficient);
  }

  // Remove sign
  str = str.replace(/^[+-]/, "");

  // Handle decimal numbers
  if (str.includes(".")) {
    // For decimal numbers, we need to be more careful about leading zeros
    const parts = str.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] || "";

    // Remove leading zeros from integer part
    const cleanIntegerPart = integerPart.replace(/^0+/, "") || "0";

    // If integer part is just zero, only count significant figures in decimal part
    if (cleanIntegerPart === "0") {
      // Remove leading zeros from decimal part
      const cleanDecimalPart = decimalPart.replace(/^0+/, "");
      return cleanDecimalPart.length || 1; // At least 1 sig fig for '0.0'
    } else {
      // Count all digits in both parts (trailing zeros after decimal are significant)
      return cleanIntegerPart.length + decimalPart.length;
    }
  } else {
    // Handle whole numbers
    // Remove leading zeros
    str = str.replace(/^0+/, "");

    if (str === "") return 1; // Was all zeros

    // For whole numbers, trailing zeros are ambiguous
    // We'll treat them as not significant unless the number has a decimal point
    // Remove trailing zeros
    str = str.replace(/0+$/, "");

    return str.length;
  }
}

/**
 * Formats a number to a specific number of significant figures
 * Matches Big.js toPrecision() behavior
 * Uses ROUND_HALF_UP rounding mode (0.5 rounds up)
 *
 * @param value - The number to format (accepts number or string)
 * @param sigfigs - The desired number of significant figures (must be a positive integer)
 * @returns The formatted number as a string
 *
 * @example
 * ```typescript
 * toSigfig(255.5, 5)     // "255.50"
 * toSigfig(123.456, 3)   // "123"
 * toSigfig(0.001234, 3)  // "0.00123"
 * toSigfig("123.456", 3) // "123" (string input supported)
 * toSigfig(2.5, 1)       // "3" (ROUND_HALF_UP: 0.5 rounds up)
 * ```
 */
export function toSigfig(value: number | string, sigfigs: number): string {
  validateSigfigs(sigfigs);

  // Use Big.js toPrecision to match behavior exactly
  const bigNum = new Big(value);

  if (bigNum.eq(0)) return "0";

  return bigNum.toPrecision(sigfigs);
}

/**
 * Determines the appropriate number of significant figures for addition/subtraction based on the least precise decimal place
 * @param values - Array of numbers to analyze
 * @returns The number of decimal places to preserve
 */
export function getDecimalPlacesForAddOrSub(values: (number | string)[]): number {
  let minDecimalPlaces = Infinity;

  for (const value of values) {
    const decimalPlaces = digitsAfterDecimal(value);

    // If any value has no decimal places, limit precision to whole numbers
    if (decimalPlaces === 0) {
      return 0;
    }

    minDecimalPlaces = Math.min(minDecimalPlaces, decimalPlaces);
  }

  return minDecimalPlaces === Infinity ? 0 : minDecimalPlaces;
}

/**
 * Determines the appropriate number of significant figures for multiplication/division based on the operand with the fewest significant figures
 * @param values - Array of numbers to analyze
 * @returns The minimum number of significant figures
 */
export function getSigfigForMulOrDiv(values: (number | string)[]): number {
  return Math.min(...values.map((v) => sigfigOf(v)));
}

/**
 * Function aliases for more intuitive naming
 */

/**
 * Alias for toSigfig - formats a number to a specified number of significant figures
 * @see toSigfig
 */
export const toPrecision = toSigfig;
