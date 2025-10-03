/**
 * Precise mathematical operations with significant figure preservation
 * Uses big.js for arbitrary-precision decimal arithmetic to avoid floating-point errors
 */

import Big from "big.js";
import {
  toSigfig,
  sigfigOf,
  getDecimalPlacesForAddOrSub,
  getSigfigForMulOrDiv,
  validateSigfigs,
} from "./sigfig.js";

/**
 * Adds two numbers while preserving default significant figures based on number of decimal places as the least precise operand, or specified significant figures if provided
 *
 * @param a - First number
 * @param b - Second number
 * @param toSigfig - Optional: specific number of significant figures to preserve in result
 * @returns The sum with appropriate significant figures as a string
 */
export function add(a: number | string, b: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigA = new Big(a);
    const bigB = new Big(b);

    // Perform precise addition using big.js
    const result = bigA.plus(bigB);

    if (toSigfigParam !== undefined) {
      // Use specified significant figures
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      // Use addition rules: preserve decimal places of least precise operand
      const decimalPlaces = getDecimalPlacesForAddOrSub([a, b]);
      return result.toFixed(decimalPlaces);
    }
  } catch {
    throw new Error("Invalid input: both operands must be valid numbers");
  }
}

/**
 * Subtracts two numbers while preserving default significant figures based on number of decimal places as the least precise operand, or specified significant figures if provided
 *
 * @param a - First number (minuend)
 * @param b - Second number (subtrahend)
 * @param toSigfig - Optional: specific number of significant figures to preserve in result
 * @returns The difference with appropriate significant figures as a string
 */
export function sub(a: number | string, b: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigA = new Big(a);
    const bigB = new Big(b);

    // Perform precise subtraction using big.js
    const result = bigA.minus(bigB);

    if (toSigfigParam !== undefined) {
      // Use specified significant figures
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      // Use subtraction rules: preserve decimal places of least precise operand
      const decimalPlaces = getDecimalPlacesForAddOrSub([a, b]);
      return result.toFixed(decimalPlaces);
    }
  } catch {
    throw new Error("Invalid input: both operands must be valid numbers");
  }
}

/**
 * Multiplies two numbers while preserving default significant figures based on number of significant figures as the least precise operand, or specified significant figures if provided
 *
 * @param a - First number
 * @param b - Second number
 * @param toSigfig - Optional: specific number of significant figures to preserve in result
 * @returns The product with appropriate significant figures as a string
 */
export function mul(a: number | string, b: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigA = new Big(a);
    const bigB = new Big(b);

    // Perform precise multiplication using big.js
    const result = bigA.times(bigB);

    if (toSigfigParam !== undefined) {
      // Use specified significant figures
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      // Use multiplication rules: use minimum significant figures from operands
      const sigfigs = getSigfigForMulOrDiv([a, b]);
      return toSigfig(result.toString(), sigfigs);
    }
  } catch {
    throw new Error("Invalid input: both operands must be valid numbers");
  }
}

/**
 * Divides two numbers while preserving default significant figures based on number of significant figures as the least precise operand, or specified significant figures if provided
 *
 * @param a - Dividend
 * @param b - Divisor
 * @param toSigfig - Optional: specific number of significant figures to preserve in result
 * @returns The quotient with appropriate significant figures as a string
 */
export function div(a: number | string, b: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigA = new Big(a);
    const bigB = new Big(b);

    // Check for division by zero
    if (bigB.eq(0)) {
      throw new Error("Division by zero is not allowed");
    }

    // Perform precise division using big.js
    const result = bigA.div(bigB);

    if (toSigfigParam !== undefined) {
      // Use specified significant figures
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      // Use division rules: use minimum significant figures from operands
      const sigfigs = getSigfigForMulOrDiv([a, b]);
      return toSigfig(result.toString(), sigfigs);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Division by zero is not allowed") {
      throw error;
    }
    throw new Error("Invalid input: both operands must be valid numbers");
  }
}

/**
 * Modulo operation with significant figure handling
 *
 * @param a - Dividend
 * @param b - Divisor
 * @param toSigfigParam - Optional: override significant figures for result
 * @returns Remainder of a divided by b
 *
 * @example
 * ```typescript
 * mod(10, 3)       // 1
 * mod(17.5, 5.2)   // 2.0 (based on input precision)
 * mod(100, 7, 3)   // 2.00 (custom: 3 significant figures)
 * ```
 */
export function mod(a: number | string, b: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigA = new Big(a);
    const bigB = new Big(b);

    // Check for modulo by zero
    if (bigB.eq(0)) {
      throw new Error("Division by zero: modulo by zero is undefined");
    }

    // Perform precise modulo using big.js
    const result = bigA.mod(bigB);

    if (toSigfigParam !== undefined) {
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      // For modulo, use the minimum significant figures from operands
      const sigfigs = getSigfigForMulOrDiv([a, b]);
      return toSigfig(result.toString(), sigfigs);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Division by zero: modulo by zero is undefined"
    ) {
      throw error;
    }
    throw new Error("Invalid input: both operands must be valid numbers");
  }
}

/**
 * Integer division (floor division) with significant figure handling
 *
 * @param a - Dividend
 * @param b - Divisor
 * @param toSigfigParam - Optional: override significant figures for result
 * @returns Integer result of a divided by b (floor division)
 *
 * @example
 * ```typescript
 * idiv(10, 3)      // 3 (floor of 10/3)
 * idiv(17, 5)      // 3 (floor of 17/5)
 * idiv(-10, 3)     // -4 (floor of -10/3)
 * idiv(22.0, 7.0, 2) // 3.0 (custom: 2 significant figures)
 * ```
 */
export function idiv(a: number | string, b: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigA = new Big(a);
    const bigB = new Big(b);

    // Check for division by zero
    if (bigB.eq(0)) {
      throw new Error("Division by zero is not allowed");
    }

    // Perform precise division and floor using big.js
    const divResult = bigA.div(bigB);
    const result = Math.floor(parseFloat(divResult.toString()));

    if (toSigfigParam !== undefined) {
      return toSigfig(result, toSigfigParam);
    } else {
      // For division, use the minimum significant figures from operands
      const sigfigs = getSigfigForMulOrDiv([a, b]);
      return toSigfig(result, sigfigs);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Division by zero is not allowed") {
      throw error;
    }
    throw new Error("Invalid input: both operands must be valid numbers");
  }
}

/**
 * Power operation with significant figure handling
 * Uses Big.js pow() for precise calculations with integer exponents
 * Falls back to Math.pow for non-integer exponents
 *
 * @param base - Base number
 * @param exponent - Exponent (integer or decimal)
 * @param toSigfigParam - Optional: override significant figures for result
 * @returns base raised to the power of exponent
 *
 * @example
 * ```typescript
 * pow(2, 3)        // "8" (2^3)
 * pow(2.5, 2)      // "6.3" (2.5^2 = 6.25, rounded to 2 sig figs)
 * pow(10, 3, 4)    // "1.000e+3" (custom: 4 significant figures)
 * pow(4, 0.5)      // "2.0" (square root)
 * ```
 */
export function pow(
  base: number | string,
  exponent: number | string,
  toSigfigParam?: number
): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigBase = new Big(base);
    const bigExponent = new Big(exponent);

    // Check for invalid cases
    if (bigBase.eq(0) && bigExponent.lt(0)) {
      throw new Error("Power operation resulted in infinite or invalid result");
    }

    let result: Big;

    // Check if exponent is an integer
    const expNum = parseFloat(bigExponent.toString());
    if (Number.isInteger(expNum)) {
      // Use Big.js pow for integer exponents (more precise)
      result = bigBase.pow(expNum);
    } else {
      // Use Math.pow for non-integer exponents
      const baseNum = parseFloat(bigBase.toString());
      const resultNum = Math.pow(baseNum, expNum);

      if (!isFinite(resultNum)) {
        throw new Error("Power operation resulted in infinite or invalid result");
      }

      result = new Big(resultNum);
    }

    if (toSigfigParam !== undefined) {
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      // For power operations, use the minimum significant figures from operands
      const sigfigs = getSigfigForMulOrDiv([base, exponent]);
      return toSigfig(result.toString(), sigfigs);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Power operation resulted in infinite or invalid result"
    ) {
      throw error;
    }
    throw new Error("Invalid input: both base and exponent must be valid numbers");
  }
}

/**
 * Square root with significant figure handling
 *
 * @param value - Number to find square root of
 * @param toSigfigParam - Optional: override significant figures for result
 * @returns Square root of the value
 *
 * @example
 * ```typescript
 * sqrt(9)          // 3
 * sqrt(2.0)        // 1.4 (based on input precision)
 * sqrt(16, 3)      // 4.00 (custom: 3 significant figures)
 * ```
 */
export function sqrt(value: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigValue = new Big(value);

    // Check for negative numbers
    if (bigValue.lt(0)) {
      throw new Error("Cannot take square root of negative number");
    }

    // Perform precise square root using big.js
    const result = bigValue.sqrt();

    if (toSigfigParam !== undefined) {
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      const sigfigs = sigfigOf(value);
      return toSigfig(result.toString(), sigfigs);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Cannot take square root of negative number") {
      throw error;
    }
    throw new Error("Invalid input: value must be a valid number");
  }
}

/**
 * Absolute value with significant figure handling
 *
 * @param value - Number to find absolute value of
 * @param toSigfigParam - Optional: override significant figures for result
 * @returns Absolute value
 *
 * @example
 * ```typescript
 * abs(-5)          // 5
 * abs(-3.14)       // 3.14
 * abs(2.5)         // 2.5
 * ```
 */
export function abs(value: number | string, toSigfigParam?: number): string {
  if (toSigfigParam !== undefined) {
    validateSigfigs(toSigfigParam);
  }
  try {
    const bigValue = new Big(value);

    // Perform precise absolute value using big.js
    const result = bigValue.abs();

    if (toSigfigParam !== undefined) {
      return toSigfig(result.toString(), toSigfigParam);
    } else {
      const sigfigs = sigfigOf(value);
      return toSigfig(result.toString(), sigfigs);
    }
  } catch {
    throw new Error("Invalid input: value must be a valid number");
  }
}

/**
 * Maximum of two or more numbers with significant figure handling
 * Invalid inputs are filtered out automatically
 *
 * @param values - Array of numbers to find maximum of
 * @param sigfigs - Optional: number of significant figures to use for comparison and result formatting
 * @returns Maximum value
 *
 * @example
 * ```typescript
 * max([1, 2, 3])           // 3
 * max([1.2, 3.4, 2.1])     // 3.4
 * max([1.234, 1.235], 3)   // 1.24 (both round to 1.23 at 3 sig figs, but 1.235 is larger)
 * max(["5.0", "3.14"], 2)  // 5.0 (string inputs supported)
 * max([1, "invalid", 3])   // 3 (invalid values filtered out)
 * ```
 */
export function max(values: (number | string)[], sigfigs?: number): string {
  if (sigfigs !== undefined) {
    validateSigfigs(sigfigs);
  }
  if (!Array.isArray(values)) {
    throw new Error("Input must be an array");
  }

  // Filter and parse valid numbers using big.js
  const validPairs: Array<{ original: number | string; big: Big }> = [];

  for (const v of values) {
    // Skip null and undefined explicitly
    if (v === null || v === undefined) {
      continue;
    }
    try {
      const bigNum = new Big(v);
      validPairs.push({ original: v, big: bigNum });
    } catch {
      // Skip invalid values
      continue;
    }
  }

  // Check if we have any valid numbers after filtering
  if (validPairs.length === 0) {
    throw new Error("No valid numbers found in array");
  }

  // Determine the significant figures to use for comparison
  const compareSigfigs =
    sigfigs !== undefined
      ? sigfigs
      : Math.min(...validPairs.map((pair) => sigfigOf(pair.original)));

  // Find the maximum using big.js comparison
  let maxBig = validPairs[0].big;
  for (let i = 1; i < validPairs.length; i++) {
    if (validPairs[i].big.gt(maxBig)) {
      maxBig = validPairs[i].big;
    }
  }

  // Apply significant figures to the result
  return toSigfig(maxBig.toString(), compareSigfigs);
}

/**
 * Minimum of two or more numbers with significant figure handling
 * Invalid inputs are filtered out automatically
 *
 * @param values - Array of numbers to find minimum of
 * @param sigfigs - Optional: number of significant figures to use for comparison and result formatting
 * @returns Minimum value
 *
 * @example
 * ```typescript
 * min([1, 2, 3])           // 1
 * min([1.2, 3.4, 2.1])     // 1.2
 * min([1.234, 1.235], 3)   // 1.23 (both round to 1.23 at 3 sig figs, but 1.234 is smaller)
 * min(["5.0", "3.14"], 2)  // 3.1 (string inputs supported)
 * min([1, "invalid", 3])   // 1 (invalid values filtered out)
 * ```
 */
export function min(values: (number | string)[], sigfigs?: number): string {
  if (sigfigs !== undefined) {
    validateSigfigs(sigfigs);
  }
  if (!Array.isArray(values)) {
    throw new Error("Input must be an array");
  }

  // Filter and parse valid numbers using big.js
  const validPairs: Array<{ original: number | string; big: Big }> = [];

  for (const v of values) {
    // Skip null and undefined explicitly
    if (v === null || v === undefined) {
      continue;
    }
    try {
      const bigNum = new Big(v);
      validPairs.push({ original: v, big: bigNum });
    } catch {
      // Skip invalid values
      continue;
    }
  }

  // Check if we have any valid numbers after filtering
  if (validPairs.length === 0) {
    throw new Error("No valid numbers found in array");
  }

  // Determine the significant figures to use for comparison
  const compareSigfigs =
    sigfigs !== undefined
      ? sigfigs
      : Math.min(...validPairs.map((pair) => sigfigOf(pair.original)));

  // Find the minimum using big.js comparison
  let minBig = validPairs[0].big;
  for (let i = 1; i < validPairs.length; i++) {
    if (validPairs[i].big.lt(minBig)) {
      minBig = validPairs[i].big;
    }
  }

  // Apply significant figures to the result
  return toSigfig(minBig.toString(), compareSigfigs);
}

/**
 * Function aliases for more intuitive naming
 */

/**
 * Alias for add() - adds two numbers with precision
 * @see add
 */
export const plus = add;

/**
 * Alias for sub() - subtracts two numbers with precision
 * @see sub
 */
export const minus = sub;

/**
 * Alias for mul() - multiplies two numbers with precision
 * @see mul
 */
export const times = mul;

/**
 * Alias for div() - divides two numbers with precision
 * @see div
 */
export const divide = div;

/**
 * Alias for mod() - modulo operation with precision
 * @see mod
 */
export const modulo = mod;

/**
 * Alias for pow() - power operation with precision
 * @see pow
 */
export const power = pow;
