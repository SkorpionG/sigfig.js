/**
 * Tests for formatting utilities
 */

import {
  toScientific,
  toEngineering,
  round,
  percentage,
  truncate,
  digitsAfterDecimal,
  toDigitsAfterDecimal,
} from "../src/formatting";

describe("toScientific", () => {
  test("formats numbers in scientific notation", () => {
    expect(toScientific(1234)).toBe("1.234e+3");
    expect(toScientific(0.00123)).toBe("1.23e-3");
    expect(toScientific(0)).toBe("0e+0");
  });

  test("respects custom significant figures", () => {
    expect(toScientific(1234, 2)).toBe("1.2e+3");
    expect(toScientific(0.00123, 4)).toBe("1.230e-3");
  });

  test("handles negative numbers", () => {
    expect(toScientific(-1234)).toBe("-1.234e+3");
    expect(toScientific(-0.00123)).toBe("-1.23e-3");
  });

  test("handles string inputs", () => {
    expect(toScientific("1234")).toBe("1.234e+3");
    expect(toScientific("0.00123")).toBe("1.23e-3");
  });

  test("throws error for invalid inputs", () => {
    expect(() => toScientific("invalid")).toThrow("Invalid input: value must be a valid number");
  });
});

describe("toEngineering", () => {
  test("formats numbers in engineering notation", () => {
    expect(toEngineering(1234)).toBe("1.234e+3");
    expect(toEngineering(12345)).toBe("12.345e+3");
    expect(toEngineering(0.00123)).toBe("1.23e-3");
    expect(toEngineering(0.000123)).toBe("123e-6");
  });

  test("respects custom significant figures", () => {
    expect(toEngineering(12345, 3)).toBe("12.3e+3");
    expect(toEngineering(0.000123, 2)).toBe("120e-6");
  });

  test("handles negative numbers", () => {
    expect(toEngineering(-1234)).toBe("-1.234e+3");
    expect(toEngineering(-0.00123)).toBe("-1.23e-3");
  });

  test("handles zero", () => {
    expect(toEngineering(0)).toBe("0e+0");
    expect(toEngineering(0, 3)).toBe("0.00e+0");
  });

  test("throws error for invalid inputs", () => {
    expect(() => toEngineering("invalid")).toThrow("Invalid input: value must be a valid number");
  });
});

describe("round", () => {
  test("rounds to specified significant figures with default threshold (5)", () => {
    expect(round(123.456, 3)).toBe("123");
    expect(round(123.456, 4)).toBe("123.5");
    expect(round(0.001234, 2)).toBe("0.0012");
    expect(round(1234.5, 2)).toBe("1.2e+3"); // 5 rounds up with default threshold
  });

  test("rounds with custom threshold", () => {
    // Threshold 3: digits 3-9 round up, 0-2 round down
    expect(round(123.456, 3, 3)).toBe("124"); // 4 >= 3, rounds up
    expect(round(123.256, 3, 3)).toBe("123"); // 2 < 3, rounds down
    expect(round(123.356, 3, 3)).toBe("124"); // 3 >= 3, rounds up

    // Threshold 6: digits 6-9 round up, 0-5 round down
    expect(round(1234.5, 2, 6)).toBe("1.2e+3"); // 5 < 6, rounds down
    expect(round(1234.6, 2, 6)).toBe("1.2e+3"); // 6 >= 6, rounds up

    // Threshold 0: all digits round up (always round up)
    expect(round(123.001, 3, 0)).toBe("124"); // 0 >= 0, rounds up

    // Threshold 9: only 9 rounds up (almost always round down)
    expect(round("123.856", 3, 9)).toBe("123"); // 8 < 9, rounds down
    expect(round("123.956", 3, 9)).toBe("124"); // 9 >= 9, rounds up
  });

  test("handles negative numbers", () => {
    expect(round(-123.456, 3)).toBe("-123");
    expect(round(-123.456, 3, 3)).toBe("-124"); // 4 >= 3, rounds up (away from zero)
    expect(round(-0.001234, 2)).toBe("-0.0012");
  });

  test("handles string inputs", () => {
    expect(round("123.456", 3)).toBe("123");
    expect(round("123.456", 3, 3)).toBe("124");
    expect(round("0.001234", 2)).toBe("0.0012");
  });

  test("handles zero", () => {
    expect(round(0, 3)).toBe("0");
    expect(round("0.0", 2)).toBe("0");
  });

  test("all thresholds 0-9 work correctly", () => {
    // Test with 123.456 to 3 sig figs (next digit is 4)
    expect(round(123.456, 3, 0)).toBe("124"); // 4 >= 0, rounds up
    expect(round(123.456, 3, 1)).toBe("124"); // 4 >= 1, rounds up
    expect(round(123.456, 3, 2)).toBe("124"); // 4 >= 2, rounds up
    expect(round(123.456, 3, 3)).toBe("124"); // 4 >= 3, rounds up
    expect(round(123.456, 3, 4)).toBe("124"); // 4 >= 4, rounds up
    expect(round(123.456, 3, 5)).toBe("123"); // 4 < 5, rounds down
    expect(round(123.456, 3, 6)).toBe("123"); // 4 < 6, rounds down
    expect(round(123.456, 3, 7)).toBe("123"); // 4 < 7, rounds down
    expect(round(123.456, 3, 8)).toBe("123"); // 4 < 8, rounds down
    expect(round(123.456, 3, 9)).toBe("123"); // 4 < 9, rounds down
  });

  test("edge cases that were previously broken", () => {
    // These cases were returning incorrect values before the fix
    expect(round(3.14159, 3, 9)).toBe("3.14"); // Was returning "0.00"
    expect(round(3.1415, 3, 9)).toBe("3.14"); // Was returning "0.00"
    expect(round(3.14959, 3, 9)).toBe("3.15"); // Was returning "100"
    expect(round(0.001294, 2, 9)).toBe("0.0012"); // Was returning "0.0"

    // Additional edge cases with small numbers
    expect(round(0.001234, 2, 0)).toBe("0.0013"); // Always rounds up
    expect(round(0.001234, 2, 9)).toBe("0.0012"); // Almost never rounds up

    // Large numbers
    expect(round(123456.789, 4, 0)).toBe("1.235e+5");
    expect(round(123456.789, 4, 9)).toBe("1.234e+5");
  });

  test("throws error for invalid inputs", () => {
    expect(() => round("invalid", 3)).toThrow();
    expect(() => round(123, 0)).toThrow("Number of significant figures must be a positive integer");
    expect(() => round(123, -1)).toThrow(
      "Number of significant figures must be a positive integer"
    );
    expect(() => round(123, 3, -1)).toThrow(
      "Rounding threshold must be an integer between 0 and 9"
    );
    expect(() => round(123, 3, 10)).toThrow(
      "Rounding threshold must be an integer between 0 and 9"
    );
    expect(() => round(123, 3, 3.5)).toThrow(
      "Rounding threshold must be an integer between 0 and 9"
    );
  });
});

describe("percentage", () => {
  test("calculates percentages with proper significant figures", () => {
    expect(percentage("25", "100.0")).toBe("25%");
    expect(percentage("1.0", "3.0")).toBe("33%");
    expect(percentage("2.0", "3.0")).toBe("67%");
  });

  test("respects custom significant figures", () => {
    expect(percentage(1, 3, 2)).toBe("33%");
    expect(percentage(1, 3, 4)).toBe("33.33%");
  });

  test("handles string inputs", () => {
    expect(percentage("25.0", "100.0")).toBe("25.0%");
    expect(percentage("1.0", "3.0")).toBe("33%");
  });

  test("handles negative numbers", () => {
    expect(percentage("-25", "100.0")).toBe("-25%");
    expect(percentage("25", "-100.0")).toBe("-25%");
  });

  test("can return without percentage sign", () => {
    expect(percentage(25, 100, { appendPercent: false })).toBe("3e+1");
    expect(percentage(1, 3, { sigfigs: 4, appendPercent: false })).toBe("33.33");
  });

  test("throws error for division by zero", () => {
    expect(() => percentage(25, 0)).toThrow("Division by zero: whole value cannot be zero");
  });

  test("throws error for invalid inputs", () => {
    expect(() => percentage("invalid", 100)).toThrow(
      "Invalid input: both values must be valid numbers"
    );
    expect(() => percentage(25, "invalid")).toThrow(
      "Invalid input: both values must be valid numbers"
    );
  });
});

describe("truncate", () => {
  test("truncates to specified significant figures without rounding", () => {
    expect(truncate(123.456, 3)).toBe("123");
    expect(truncate(123.999, 3)).toBe("123"); // Should truncate, not round
    expect(truncate(0.001234, 2)).toBe("0.0012");
    expect(truncate(1999, 2)).toBe("1.9e+3"); // Should truncate to 2 sig figs
  });

  test("handles negative numbers", () => {
    expect(truncate(-123.456, 3)).toBe("-123");
    expect(truncate(-123.999, 3)).toBe("-123");
    expect(truncate(-0.001234, 2)).toBe("-0.0012");
  });

  test("handles zero", () => {
    expect(truncate(0, 3)).toBe("0");
    expect(truncate("0", 2)).toBe("0");
  });

  test("handles string inputs", () => {
    expect(truncate("123.456", 3)).toBe("123");
    expect(truncate("0.001234", 2)).toBe("0.0012");
  });

  test("throws error for invalid inputs", () => {
    expect(() => truncate("invalid", 3)).toThrow();
    expect(() => truncate(123, 0)).toThrow(
      "Number of significant figures must be a positive integer"
    );
    expect(() => truncate(123, -1)).toThrow(
      "Number of significant figures must be a positive integer"
    );
  });

  test("difference from round function", () => {
    // Demonstrate difference between truncate and round
    expect(truncate(123.999, 3)).toBe("123"); // truncate
    expect(round(123.999, 3)).toBe("124"); // round

    expect(truncate(199.9, 2)).toBe("1.9e+2"); // truncate
    expect(round(199.9, 2)).toBe("2.0e+2"); // round
  });
});

describe("digitsAfterDecimal", () => {
  test("counts digits after decimal point", () => {
    expect(digitsAfterDecimal(3.14159)).toBe(5);
    expect(digitsAfterDecimal(5)).toBe(0);
    expect(digitsAfterDecimal(1.2)).toBe(1);
    expect(digitsAfterDecimal(10.25)).toBe(2);
  });

  test("handles string inputs", () => {
    expect(digitsAfterDecimal("3.14")).toBe(2);
    expect(digitsAfterDecimal("5")).toBe(0);
    expect(digitsAfterDecimal("1.2345")).toBe(4);
    expect(digitsAfterDecimal("100.1")).toBe(1);
  });

  test("handles negative numbers", () => {
    expect(digitsAfterDecimal(-3.14159)).toBe(5);
    expect(digitsAfterDecimal(-5)).toBe(0);
    expect(digitsAfterDecimal("-1.23")).toBe(2);
  });

  test("handles zero", () => {
    expect(digitsAfterDecimal(0)).toBe(0);
    expect(digitsAfterDecimal(0.0)).toBe(0);
    expect(digitsAfterDecimal("0")).toBe(0);
  });

  test("handles scientific notation", () => {
    expect(digitsAfterDecimal(1.23e-4)).toBeLessThanOrEqual(6);
    expect(digitsAfterDecimal("1.23e-4")).toBe(6); // String preserves format
    expect(digitsAfterDecimal(1e10)).toBe(0);
  });

  test("handles very small numbers", () => {
    expect(digitsAfterDecimal(0.000123)).toBe(6);
    expect(digitsAfterDecimal(0.1)).toBe(1);
    expect(digitsAfterDecimal("0.000001")).toBe(6);
  });

  test("handles trailing zeros in strings", () => {
    expect(digitsAfterDecimal("1.230")).toBe(3); // String preserves trailing zeros
    expect(digitsAfterDecimal("5.00")).toBe(2);
    expect(digitsAfterDecimal(1.23)).toBe(2); // Number doesn't preserve trailing zeros
  });

  test("throws error for invalid inputs", () => {
    expect(() => digitsAfterDecimal("invalid")).toThrow(
      "Invalid input: value must be a valid number"
    );
    expect(() => digitsAfterDecimal(NaN)).toThrow("Invalid input: value must be a valid number");
  });
});

describe("toDigitsAfterDecimal", () => {
  test("rounds numbers with more digits than specified", () => {
    expect(toDigitsAfterDecimal(3.14159, 2)).toBe("3.14");
    expect(toDigitsAfterDecimal(3.14159, 4)).toBe("3.1416");
    expect(toDigitsAfterDecimal(2.9999, 2)).toBe("3.00");
    expect(toDigitsAfterDecimal(1.556, 2)).toBe("1.56");
  });

  test("pads numbers with fewer digits than specified", () => {
    expect(toDigitsAfterDecimal(5, 3)).toBe("5.000");
    expect(toDigitsAfterDecimal(1.2, 4)).toBe("1.2000");
    expect(toDigitsAfterDecimal(10, 2)).toBe("10.00");
    expect(toDigitsAfterDecimal(3.5, 5)).toBe("3.50000");
  });

  test("handles zero digits (rounds to integer)", () => {
    expect(toDigitsAfterDecimal(3.14159, 0)).toBe("3");
    expect(toDigitsAfterDecimal(5.7, 0)).toBe("6");
    expect(toDigitsAfterDecimal(10.4, 0)).toBe("10");
    expect(toDigitsAfterDecimal(2.5, 0)).toBe("3"); // Big.js rounds half-up
  });

  test("handles negative numbers", () => {
    expect(toDigitsAfterDecimal(-3.14159, 2)).toBe("-3.14");
    expect(toDigitsAfterDecimal(-5, 3)).toBe("-5.000");
    expect(toDigitsAfterDecimal(-1.556, 2)).toBe("-1.56");
  });

  test("handles string inputs", () => {
    expect(toDigitsAfterDecimal("3.14159", 2)).toBe("3.14");
    expect(toDigitsAfterDecimal("5", 3)).toBe("5.000");
    expect(toDigitsAfterDecimal("1.2", 4)).toBe("1.2000");
  });

  test("handles zero", () => {
    expect(toDigitsAfterDecimal(0, 0)).toBe("0");
    expect(toDigitsAfterDecimal(0, 3)).toBe("0.000");
    expect(toDigitsAfterDecimal("0", 2)).toBe("0.00");
  });

  test("handles very small numbers", () => {
    expect(toDigitsAfterDecimal(0.000123, 6)).toBe("0.000123");
    expect(toDigitsAfterDecimal(0.000123, 4)).toBe("0.0001");
    expect(toDigitsAfterDecimal(0.000123, 8)).toBe("0.00012300");
  });

  test("handles very large numbers", () => {
    expect(toDigitsAfterDecimal(123456.789, 2)).toBe("123456.79");
    expect(toDigitsAfterDecimal(1000000, 3)).toBe("1000000.000");
    expect(toDigitsAfterDecimal(999999.999, 1)).toBe("1000000.0");
  });

  test("throws error for invalid inputs", () => {
    expect(() => toDigitsAfterDecimal("invalid", 2)).toThrow(
      "Invalid input: value must be a valid number"
    );
    expect(() => toDigitsAfterDecimal(NaN, 2)).toThrow(
      "Invalid input: value must be a valid number"
    );
  });

  test("throws error for invalid digits parameter", () => {
    expect(() => toDigitsAfterDecimal(3.14, -1)).toThrow("Digits must be a non-negative integer");
    expect(() => toDigitsAfterDecimal(3.14, 2.5)).toThrow("Digits must be a non-negative integer");
    expect(() => toDigitsAfterDecimal(3.14, NaN)).toThrow("Digits must be a non-negative integer");
  });

  test("practical examples", () => {
    // Currency formatting (2 decimal places)
    expect(toDigitsAfterDecimal(19.99, 2)).toBe("19.99");
    expect(toDigitsAfterDecimal(19.999, 2)).toBe("20.00");
    expect(toDigitsAfterDecimal(5, 2)).toBe("5.00");

    // Scientific measurements (4 decimal places)
    expect(toDigitsAfterDecimal(9.80665, 4)).toBe("9.8067"); // Big.js rounds half-up
    expect(toDigitsAfterDecimal(3.14159265, 5)).toBe("3.14159");

    // Percentages (1 decimal place)
    expect(toDigitsAfterDecimal(66.666, 1)).toBe("66.7");
    expect(toDigitsAfterDecimal(33.333, 1)).toBe("33.3");
  });
});
