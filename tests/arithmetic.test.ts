/**
 * Tests for arithmetic operations with significant figures
 */

import { add, sub, mul, div, mod, idiv, pow, sqrt, abs, max, min } from "../src/arithmetic";

describe("add", () => {
  test("adds numbers with proper significant figure handling", () => {
    // Addition preserves decimal places of least precise operand
    expect(add(1.23, 4.5)).toBe("5.7"); // 4.5 has 1 decimal place
    expect(add(1.234, 2.56)).toBe("3.79"); // 2.56 has 2 decimal places
    expect(add(123, 4.567)).toBe("128"); // 123 has 0 decimal places
  });

  test("handles string inputs", () => {
    expect(add("1.23", "4.5")).toBe("5.7");
    expect(add(1.23, "4.5")).toBe("5.7");
  });

  test("respects custom sigfig parameter", () => {
    expect(parseFloat(add(1.234, 5.678, 3))).toBeCloseTo(6.91, 2);
    expect(parseFloat(add(123.456, 78.9, 2))).toBeCloseTo(200, 0);
  });

  test("throws error for invalid inputs", () => {
    expect(() => add("invalid", 5)).toThrow();
    expect(() => add(5, "invalid")).toThrow();
  });
});

describe("sub", () => {
  test("subtracts numbers with proper significant figure handling", () => {
    expect(sub(5.67, 1.2)).toBe("4.5"); // 1.2 has 1 decimal place
    expect(sub(10.234, 3.45)).toBe("6.78"); // 3.45 has 2 decimal places
    expect(sub(500, 23.4)).toBe("477"); // 500 has 0 decimal places
  });

  test("handles string inputs", () => {
    expect(sub("5.67", "1.2")).toBe("4.5");
    expect(sub(5.67, "1.2")).toBe("4.5");
  });

  test("respects custom sigfig parameter", () => {
    expect(parseFloat(sub(10.234, 3.456, 3))).toBeCloseTo(6.78, 2);
  });

  test("throws error for invalid inputs", () => {
    expect(() => sub("invalid", 5)).toThrow();
    expect(() => sub(5, "invalid")).toThrow();
  });
});

describe("mul", () => {
  test("multiplies numbers with proper significant figure handling", () => {
    // Multiplication uses minimum significant figures from operands
    expect(parseFloat(mul(1.23, 4.5))).toBeCloseTo(5.5, 1); // min(3, 2) = 2 sigfigs
    expect(parseFloat(mul(2.34, 5.6))).toBeCloseTo(13, 1); // min(3, 2) = 2 sigfigs
    expect(parseFloat(mul(100, 2.5))).toBeCloseTo(300, 0); // min(1, 2) = 1 sigfig -> 3e+2
  });

  test("handles string inputs", () => {
    expect(parseFloat(mul("1.23", "4.5"))).toBeCloseTo(5.5, 1);
    expect(parseFloat(mul(1.23, "4.5"))).toBeCloseTo(5.5, 1);
  });

  test("respects custom sigfig parameter", () => {
    expect(parseFloat(mul(1.234, 5.678, 4))).toBeCloseTo(7.007, 3);
  });

  test("throws error for invalid inputs", () => {
    expect(() => mul("invalid", 5)).toThrow();
    expect(() => mul(5, "invalid")).toThrow();
  });
});

describe("div", () => {
  test("divides numbers with proper significant figure handling", () => {
    // Division uses minimum significant figures from operands
    expect(parseFloat(div("10.0", "3.0"))).toBeCloseTo(3.3, 1); // min(3, 2) = 2 sigfigs
    expect(parseFloat(div(15.6, 2.1))).toBeCloseTo(7.4, 1); // min(3, 2) = 2 sigfigs
  });

  test("handles string inputs", () => {
    expect(parseFloat(div("10.0", "3.0"))).toBeCloseTo(3.3, 1);
    expect(parseFloat(div("10.0", "3.0"))).toBeCloseTo(3.3, 1);
  });

  test("respects custom sigfig parameter", () => {
    expect(parseFloat(div(22.0, 7.0, 4))).toBeCloseTo(3.143, 3);
  });

  test("throws error for division by zero", () => {
    expect(() => div(5, 0)).toThrow("Division by zero is not allowed");
    expect(() => div(5, "0")).toThrow("Division by zero is not allowed");
  });

  test("throws error for invalid inputs", () => {
    expect(() => div("invalid", 5)).toThrow();
    expect(() => div(5, "invalid")).toThrow();
  });
});

describe("mod", () => {
  test("performs modulo operation", () => {
    expect(parseFloat(mod(10, 3))).toBe(1);
    expect(parseFloat(mod(17, 5))).toBe(2);
    expect(parseFloat(mod(100, 7))).toBe(2);
  });

  test("handles decimal numbers", () => {
    expect(parseFloat(mod(17.5, 5.2))).toBeCloseTo(1.9, 1);
    expect(parseFloat(mod(10.7, 3.2))).toBeCloseTo(1.1, 1);
  });

  test("handles negative numbers", () => {
    expect(parseFloat(mod(-10, 3))).toBe(-1);
    expect(parseFloat(mod(10, -3))).toBe(1);
  });

  test("respects custom sigfig parameter", () => {
    expect(parseFloat(mod(100, 7, 3))).toBeCloseTo(2.0, 2);
  });

  test("throws error for modulo by zero", () => {
    expect(() => mod(5, 0)).toThrow("Division by zero: modulo by zero is undefined");
  });
});

describe("idiv", () => {
  test("performs integer division", () => {
    expect(parseFloat(idiv(10, 3))).toBe(3);
    expect(parseFloat(idiv(17, 5))).toBe(3);
    expect(parseFloat(idiv(20, 4))).toBe(5);
  });

  test("handles negative numbers correctly", () => {
    expect(parseFloat(idiv(-10, 3))).toBe(-4); // Floor division
    expect(parseFloat(idiv(10, -3))).toBe(-4);
    expect(parseFloat(idiv(-10, -3))).toBe(3);
  });

  test("respects custom sigfig parameter", () => {
    expect(parseFloat(idiv(22.0, 7.0, 2))).toBeCloseTo(3.0, 1);
  });

  test("throws error for division by zero", () => {
    expect(() => idiv(5, 0)).toThrow("Division by zero is not allowed");
  });
});

describe("pow", () => {
  test("performs power operation", () => {
    expect(parseFloat(pow(2, 3))).toBe(8);
    expect(parseFloat(pow("5.0", "2.0"))).toBe(25);
    expect(parseFloat(pow(10, 0))).toBe(1);
  });

  test("handles decimal exponents", () => {
    expect(parseFloat(pow(4, 0.5))).toBe(2); // Square root
    expect(parseFloat(pow(8, 1 / 3))).toBeCloseTo(2, 10); // Cube root
  });

  test("handles negative bases", () => {
    expect(parseFloat(pow(-2, 3))).toBe(-8);
    expect(parseFloat(pow(-2, 2))).toBe(4);
  });

  test("respects significant figures", () => {
    expect(parseFloat(pow(2.5, "2.0"))).toBeCloseTo(6.3, 1);
  });

  test("throws error for invalid results", () => {
    expect(() => pow(0, -1)).toThrow("Power operation resulted in infinite or invalid result");
  });
});

describe("sqrt", () => {
  test("calculates square root", () => {
    expect(parseFloat(sqrt(9))).toBe(3);
    expect(parseFloat(sqrt(16))).toBe(4);
    expect(parseFloat(sqrt(25))).toBe(5);
  });

  test("handles decimal numbers", () => {
    expect(parseFloat(sqrt("2.0"))).toBeCloseTo(1.4, 1);
    expect(parseFloat(sqrt(6.25))).toBeCloseTo(2.5, 1);
  });

  test("respects custom sigfig parameter", () => {
    expect(parseFloat(sqrt(16, 3))).toBeCloseTo(4.0, 2);
  });

  test("throws error for negative numbers", () => {
    expect(() => sqrt(-4)).toThrow("Cannot take square root of negative number");
  });
});

describe("abs", () => {
  test("calculates absolute value", () => {
    expect(parseFloat(abs(-5))).toBe(5);
    expect(parseFloat(abs(5))).toBe(5);
    expect(parseFloat(abs(0))).toBe(0);
  });

  test("handles decimal numbers", () => {
    expect(parseFloat(abs(-3.14))).toBe(3.14);
    expect(parseFloat(abs(2.5))).toBe(2.5);
  });

  test("respects significant figures", () => {
    expect(abs("-5.0")).toBe("5.0"); // Use string input to preserve trailing zero
  });
});

describe("max", () => {
  test("finds maximum value", () => {
    expect(parseFloat(max([1, 2, 3]))).toBe(3);
    expect(parseFloat(max([5, 1, 9, 3]))).toBe(9);
    expect(parseFloat(max([-1, -5, -2]))).toBe(-1);
  });

  test("handles decimal numbers", () => {
    expect(parseFloat(max([1.2, 3.4, 2.1]))).toBe(3.4);
    expect(parseFloat(max([5.0, 3.14]))).toBeCloseTo(5.0, 1);
  });

  test("handles string inputs", () => {
    expect(parseFloat(max(["1", "2", "3"]))).toBe(3);
    expect(parseFloat(max(["5.0", "3.14"]))).toBeCloseTo(5.0, 1);
    expect(parseFloat(max([1, "2.5", 3]))).toBe(3);
  });

  test("uses sigfig parameter for comparison", () => {
    // With 2 sig figs: 5.0 rounds to 5.0, 3.14 rounds to 3.1
    expect(parseFloat(max([5.0, 3.14], 2))).toBe(5.0);

    // With 3 sig figs: 1.234 rounds to 1.23, 1.235 rounds to 1.24
    expect(parseFloat(max([1.234, 1.235], 3))).toBe(1.24);

    // With 1 sig fig: 5.5 rounds to 6, 4.9 rounds to 5
    expect(parseFloat(max([5.5, 4.9], 1))).toBe(6);
  });

  test("uses minimum sigfigs from inputs when no parameter provided", () => {
    // 5.0 has 2 sig figs, 3.14 has 3 sig figs, use 2 for comparison
    expect(parseFloat(max([5.0, 3.14]))).toBe(5.0);

    // 100 has 1 sig fig, 99.9 has 3 sig figs, use 1 for comparison
    expect(parseFloat(max([100, 99.9]))).toBe(100);
  });

  test("filters out invalid values automatically", () => {
    expect(parseFloat(max([1, "invalid", 3]))).toBe(3);
    expect(parseFloat(max(["invalid", 2, "bad", 5]))).toBe(5);
    expect(parseFloat(max([NaN, 1, 2, 3]))).toBe(3);
    expect(parseFloat(max([Infinity, 1, 2, 3]))).toBe(3);
    expect(parseFloat(max([1, undefined as any, 2, null as any, 3]))).toBe(3);
  });

  test("throws error when no valid numbers found", () => {
    expect(() => max([])).toThrow("No valid numbers found in array");
    expect(() => max(["invalid", "bad", NaN])).toThrow("No valid numbers found in array");
    expect(() => max([undefined as any, null as any, Infinity])).toThrow(
      "No valid numbers found in array"
    );
  });

  test("throws error for non-array input", () => {
    expect(() => max("not an array" as any)).toThrow("Input must be an array");
  });
});

describe("min", () => {
  test("finds minimum value", () => {
    expect(parseFloat(min([1, 2, 3]))).toBe(1);
    expect(parseFloat(min([5, 1, 9, 3]))).toBe(1);
    expect(parseFloat(min([-1, -5, -2]))).toBe(-5);
  });

  test("handles decimal numbers", () => {
    expect(parseFloat(min([1.2, 3.4, 2.1]))).toBe(1.2);
    expect(parseFloat(min(["5.0", 3.14]))).toBe(3.1);
  });

  test("handles string inputs", () => {
    expect(parseFloat(min(["1", "2", "3"]))).toBe(1);
    expect(parseFloat(min(["5.0", "3.14"]))).toBeCloseTo(3.1, 1);
    expect(parseFloat(min([1, "2.5", 3]))).toBe(1);
  });

  test("uses sigfig parameter for comparison", () => {
    // With 2 sig figs: 5.0 rounds to 5.0, 3.14 rounds to 3.1
    expect(parseFloat(min([5.0, 3.14], 2))).toBe(3.1);

    // With 3 sig figs: 1.234 rounds to 1.23, 1.235 rounds to 1.24
    expect(parseFloat(min([1.234, 1.235], 3))).toBe(1.23);

    // With 1 sig fig: 5.5 rounds to 6, 4.9 rounds to 5
    expect(parseFloat(min([5.5, 4.9], 1))).toBe(5);
  });

  test("uses minimum sigfigs from inputs when no parameter provided", () => {
    // 5.0 has 2 sig figs, 3.14 has 3 sig figs, use 2 for comparison
    expect(parseFloat(min(["5.0", 3.14]))).toBe(3.1);

    // 100 has 1 sig fig, 99.9 has 3 sig figs, use 1 for comparison
    expect(parseFloat(min([100, 99.9]))).toBe(100);
  });

  test("filters out invalid values automatically", () => {
    expect(parseFloat(min([1, "invalid", 3]))).toBe(1);
    expect(parseFloat(min(["invalid", 2, "bad", 5]))).toBe(2);
    expect(parseFloat(min([NaN, 1, 2, 3]))).toBe(1);
    expect(parseFloat(min([Infinity, 1, 2, 3]))).toBe(1);
    expect(parseFloat(min([1, undefined as any, 2, null as any, 3]))).toBe(1);
  });

  test("throws error when no valid numbers found", () => {
    expect(() => min([])).toThrow("No valid numbers found in array");
    expect(() => min(["invalid", "bad", NaN])).toThrow("No valid numbers found in array");
    expect(() => min([undefined as any, null as any, Infinity])).toThrow(
      "No valid numbers found in array"
    );
  });

  test("throws error for non-array input", () => {
    expect(() => min("not an array" as any)).toThrow("Input must be an array");
  });
});
