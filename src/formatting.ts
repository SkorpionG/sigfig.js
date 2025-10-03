/**
 * Scientific notation and number formatting utilities
 */

import Big from "big.js";
import { sigfigOf, toSigfig, validateSigfigs } from "./sigfig.js";

/**
 * Formats a number in scientific notation with proper significant figures
 *
 * @param value - The number to format
 * @param sigfigs - Optional: number of significant figures (default: based on input)
 * @returns The number in scientific notation (e.g., "1.23e+4")
 *
 * @example
 * ```typescript
 * toScientific(1234)      // "1.234e+3"
 * toScientific(0.00123)   // "1.23e-3"
 * toScientific(1234, 2)   // "1.2e+3"
 * ```
 */
export function toScientific(value: number | string, sigfigs?: number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    throw new Error("Invalid input: value must be a valid number");
  }

  if (num === 0) {
    return sigfigs ? `0.${"0".repeat(sigfigs - 1)}e+0` : "0e+0";
  }

  const actualSigfigs = sigfigs || sigfigOf(value);
  if (sigfigs !== undefined) {
    validateSigfigs(sigfigs);
  }

  // Convert to the specified significant figures using toSigfig
  const rounded = toSigfig(num, actualSigfigs);

  // Parse the rounded value and use Big.js toExponential with decimal places
  const bigNum = new Big(rounded);
  // toExponential needs decimal places (sigfigs - 1 for the coefficient)
  return bigNum.toExponential(actualSigfigs - 1);
}

/**
 * Formats a number in engineering notation (powers of 3)
 *
 * @param value - The number to format
 * @param sigfigs - Optional: number of significant figures (default: based on input)
 * @returns The number in engineering notation (e.g., "1.23e+3", "123e+0")
 *
 * @example
 * ```typescript
 * toEngineering(1234)     // "1.234e+3"
 * toEngineering(0.00123)  // "1.23e-3"
 * toEngineering(12345)    // "12.345e+3"
 * ```
 */
export function toEngineering(value: number | string, sigfigs?: number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    throw new Error("Invalid input: value must be a valid number");
  }

  if (num === 0) {
    return sigfigs ? `0.${"0".repeat(sigfigs - 1)}e+0` : "0e+0";
  }

  const actualSigfigs = sigfigs || sigfigOf(value);
  if (sigfigs !== undefined) {
    validateSigfigs(sigfigs);
  }
  const sign = num < 0 ? "-" : "";
  const absNum = Math.abs(num);

  // Find the appropriate power of 3
  const log10 = Math.log10(absNum);
  const engineeringExponent = Math.floor(log10 / 3) * 3;

  // Calculate the coefficient
  const coefficient = absNum / Math.pow(10, engineeringExponent);

  // Format the coefficient with appropriate significant figures
  const formattedCoeff = parseFloat(coefficient.toPrecision(actualSigfigs));

  return `${sign}${formattedCoeff}e${engineeringExponent >= 0 ? "+" : ""}${engineeringExponent}`;
}

/**
 * Rounds a number to a specific number of significant figures with customizable rounding threshold
 *
 * @param value - The number to round
 * @param sigfigs - Number of significant figures to round to
 * @param roundingThreshold - Optional: the digit value (0-9) at which to round up (default: 5). It checks the digit immediately after the last significant figure. If that digit >= threshold, rounds up; otherwise rounds down.
 * @returns The rounded number as a string
 *
 * @example
 * ```typescript
 * // Default threshold (5) - standard rounding
 * round(3.14159, 3)        // "3.14" (next digit is 1, 1 < 5, rounds down)
 * round(3.14159, 4)        // "3.142" (next digit is 5, 5 >= 5, rounds up)
 *
 * // Threshold 9 - only round up if next digit is 9
 * round(3.14159, 3, 9)     // "3.14" (next digit is 1, 1 < 9, rounds down)
 * round(3.1415, 3, 9)      // "3.14" (next digit is 1, 1 < 9, rounds down)
 * round(3.14959, 3, 9)     // "3.15" (next digit is 9, 9 >= 9, rounds up)
 *
 * // Threshold 3 - round up if next digit is 3 or higher
 * round(123.456, 3, 3)     // "124" (next digit is 4, 4 >= 3, rounds up)
 * round(123.256, 3, 3)     // "123" (next digit is 2, 2 < 3, rounds down)
 * ```
 */
export function round(
  value: number | string,
  sigfigs: number,
  roundingThreshold: number = 5
): string {
  validateSigfigs(sigfigs);
  const bigNum = new Big(value);

  if (roundingThreshold < 0 || roundingThreshold > 9 || !Number.isInteger(roundingThreshold)) {
    throw new Error("Rounding threshold must be an integer between 0 and 9");
  }

  if (bigNum.eq(0)) return "0";

  // For default threshold (5), use Big.js built-in rounding (ROUND_HALF_UP)
  if (roundingThreshold === 5) {
    return bigNum.toPrecision(sigfigs);
  }

  // For custom thresholds, we need to manually check the digit after the last sig fig
  const absNum = bigNum.abs();
  const isNegative = bigNum.s === -1;

  // Get the string representation with enough precision to see the actual next digit
  // We need significantly more precision to avoid Big.js rounding the digit we want to check
  const strWithExtraPrecision = absNum.toPrecision(sigfigs + 10);

  // Extract all digits (remove decimal point and scientific notation)
  let digits = "";

  // Handle scientific notation to get the actual digits
  const scientificMatch = strWithExtraPrecision.match(/^(\d)\.?(\d*)e([+-]?\d+)$/i);
  if (scientificMatch) {
    // For scientific notation, extract the coefficient digits
    digits = scientificMatch[1] + (scientificMatch[2] || "");
  } else {
    // For regular notation, just remove the decimal point
    digits = strWithExtraPrecision.replace(".", "");
  }

  // The digit we need to check is at position sigfigs (0-indexed)
  const checkDigit = parseInt(digits[sigfigs] || "0", 10);

  // Calculate the magnitude and position for rounding
  const magnitude = absNum.eq(0) ? 0 : Math.floor(Math.log10(absNum.toNumber()));
  const roundPosition = magnitude - sigfigs + 1;

  // Scale the number so we can truncate it
  const scaleFactor = new Big(10).pow(-roundPosition);
  const scaled = absNum.times(scaleFactor);

  // Truncate (round down) to get the base value
  const truncated = new Big(Math.floor(scaled.toNumber()));

  // Decide whether to round up or down based on the threshold
  let result: Big;
  if (checkDigit >= roundingThreshold) {
    // Round up: add 1 to the truncated value
    result = truncated.plus(1).div(scaleFactor);
  } else {
    // Round down: use the truncated value
    result = truncated.div(scaleFactor);
  }

  // Apply sign
  if (isNegative) {
    result = result.times(-1);
  }

  // Format to the correct number of significant figures
  return result.toPrecision(sigfigs);
}

/**
 * Truncates a number to a specific number of significant figures (no rounding)
 *
 * @param value - The number to truncate
 * @param sigfigs - Number of significant figures to truncate to
 * @returns The truncated number as a string
 *
 * @example
 * ```typescript
 * truncate(123.456, 3)   // "123"
 * truncate(0.001234, 2)  // "0.0012"
 * truncate(1234.5, 2)    // "1.2e+3"
 * ```
 */
export function truncate(value: number | string, sigfigs: number): string {
  validateSigfigs(sigfigs);
  const bigNum = new Big(value);

  if (bigNum.eq(0)) {
    return "0";
  }

  const absNum = bigNum.abs();
  const isNegative = bigNum.s === -1;

  // Find the order of magnitude
  const magnitude = Math.floor(Math.log10(absNum.toNumber()));

  // Calculate the position for truncation
  const truncatePosition = magnitude - sigfigs + 1;

  // Scale the number so we can truncate it
  const scaleFactor = new Big(10).pow(-truncatePosition);
  const scaled = absNum.times(scaleFactor);

  // Truncate (round down) to get the base value
  const truncated = new Big(Math.floor(scaled.toNumber()));

  // Scale back
  let result = truncated.div(scaleFactor);

  // Apply sign
  if (isNegative) {
    result = result.times(-1);
  }

  // Format to the correct number of significant figures
  return result.toPrecision(sigfigs);
}

/**
 * Calculates percentage with proper significant figure handling
 * @param part - The part value
 * @param whole - The whole value
 * @param options - Either the number of significant figures or an options object
 * @param options.sigfigs - Number of significant figures (default: based on inputs)
 * @param options.appendPercent - Whether to append '%' to the result (default: true)
 * @returns The percentage value as a string with optional '%' sign
 *
 * @example
 * ```typescript
 * percentage(25, 100)           // "25%"
 * percentage(1, 3)              // "33.3%"
 * percentage(1, 3, 2)           // "33%"
 * percentage(1, 3, { sigfigs: 4 }) // "33.33%"
 * percentage(1, 3, { appendPercent: false }) // "33.3"
 * ```
 */
export function percentage(
  part: number | string,
  whole: number | string,
  options?: number | { sigfigs?: number; appendPercent?: boolean }
): string {
  try {
    const bigPart = new Big(part);
    const bigWhole = new Big(whole);

    // Check for division by zero
    if (bigWhole.eq(0)) {
      throw new Error("Division by zero: whole value cannot be zero");
    }

    // Handle options
    let sigfigs: number | undefined;
    let appendPercent = true;

    if (typeof options === "number") {
      sigfigs = options;
    } else if (options && typeof options === "object") {
      sigfigs = options.sigfigs;
      if (options.appendPercent === false) {
        appendPercent = false;
      }
    }

    // Perform precise percentage calculation using big.js
    const result = bigPart.div(bigWhole).times(100);

    // Format the result with proper significant figures
    const formattedResult =
      sigfigs !== undefined
        ? toSigfig(result.toString(), sigfigs)
        : toSigfig(result.toString(), Math.min(sigfigOf(part), sigfigOf(whole)));

    return appendPercent ? `${formattedResult}%` : formattedResult;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Division by zero: whole value cannot be zero"
    ) {
      throw error;
    }
    throw new Error("Invalid input: both values must be valid numbers");
  }
}

/**
 * Counts the number of digits after the decimal point in a number
 *
 * @param value - The number to analyze
 * @returns The count of digits after the decimal point
 *
 * @example
 * ```typescript
 * digitsAfterDecimal(3.14159)   // 5
 * digitsAfterDecimal(5)         // 0
 * digitsAfterDecimal(1.2)       // 1
 * digitsAfterDecimal("3.14")    // 2
 * digitsAfterDecimal(1.230)     // 2 (trailing zeros are not counted in JS number representation)
 * ```
 */
export function digitsAfterDecimal(value: number | string): number {
  const str = String(value);

  // Check if the string is a valid number
  const num = parseFloat(str);
  if (isNaN(num)) {
    throw new Error("Invalid input: value must be a valid number");
  }

  // Handle scientific notation
  if (str.includes("e") || str.includes("E")) {
    // Parse scientific notation: e.g., "1.23e-4" or "1.23E+5"
    const match = str.match(/^([+-]?)(\d+\.?\d*)[eE]([+-]?\d+)$/);
    if (match) {
      const coefficient = match[2];
      const exponent = parseInt(match[3], 10);

      // Count decimal places in coefficient
      const coeffDecimalIndex = coefficient.indexOf(".");
      const coeffDecimalPlaces =
        coeffDecimalIndex === -1 ? 0 : coefficient.length - coeffDecimalIndex - 1;

      // Calculate total decimal places after applying exponent
      // For negative exponent: add |exponent| decimal places
      // For positive exponent: subtract exponent from decimal places (can go negative)
      const totalDecimalPlaces = coeffDecimalPlaces - exponent;

      return Math.max(0, totalDecimalPlaces);
    }

    // Fallback for number type in scientific notation
    // Just count the significant decimal digits
    return 0;
  }

  // Find decimal point
  const decimalIndex = str.indexOf(".");

  // No decimal point means no digits after decimal
  if (decimalIndex === -1) {
    return 0;
  }

  // Count digits after decimal point
  return str.length - decimalIndex - 1;
}

/**
 * Formats a number with a specified number of digits after the decimal point
 * Rounds if the number has more digits, pads with zeros if it has fewer
 * Matches Big.js toFixed() behavior - returns a string with trailing zeros
 *
 * @param value - The number to format
 * @param digits - Number of digits after the decimal point
 * @returns The formatted number as a string with trailing zeros
 *
 * @example
 * ```typescript
 * toDigitsAfterDecimal(3.14159, 2)   // "3.14"
 * toDigitsAfterDecimal(3.14159, 4)   // "3.1416" (rounded)
 * toDigitsAfterDecimal(5, 3)         // "5.000" (padded)
 * toDigitsAfterDecimal(255.5, 5)     // "255.50000" (padded)
 * ```
 */
export function toDigitsAfterDecimal(value: number | string, digits: number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    throw new Error("Invalid input: value must be a valid number");
  }

  if (!Number.isInteger(digits) || digits < 0) {
    throw new Error("Digits must be a non-negative integer");
  }

  // Use Big.js toFixed to match behavior exactly
  const bigNum = new Big(num);
  return bigNum.toFixed(digits);
}

/**
 * Function aliases for more intuitive naming
 */

/**
 * Alias for toDigitsAfterDecimal() - formats a number with specified decimal places
 * @see toDigitsAfterDecimal
 */
export const toFixed = toDigitsAfterDecimal;

/**
 * Alias for toScientific() - formats a number in scientific notation
 * @see toScientific
 */
export const toExponential = toScientific;
