/**
 * Tests for significant figure utilities
 */

import {
  sigfigOf,
  toSigfig,
  getDecimalPlacesForAddOrSub,
  getSigfigForMulOrDiv,
} from "../src/sigfig";

describe("sigfigOf", () => {
  describe("Rule 1: All non-zero digits are always significant", () => {
    test("counts all non-zero digits", () => {
      expect(sigfigOf(123)).toBe(3);
      expect(sigfigOf(456789)).toBe(6);
      expect(sigfigOf(1.23)).toBe(3);
      expect(sigfigOf(9.876)).toBe(4);
      expect(sigfigOf("987654321")).toBe(9);
    });
  });

  describe("Rule 2: Zeros between non-zero digits are significant", () => {
    test("counts zeros between non-zero digits", () => {
      expect(sigfigOf(101)).toBe(3); // Zero between 1 and 1
      expect(sigfigOf(1001)).toBe(4); // Two zeros between 1 and 1
      expect(sigfigOf(10203)).toBe(5); // Multiple zeros between non-zero digits
      expect(sigfigOf(1.02)).toBe(3); // Zero between 1 and 2 after decimal
      expect(sigfigOf("5.006")).toBe(4); // Two zeros between 5 and 6
    });
  });

  describe("Rule 3: Leading zeros (before the first non-zero digit) are never significant", () => {
    test("does not count leading zeros", () => {
      expect(sigfigOf(0.123)).toBe(3); // Leading zero before decimal
      expect(sigfigOf(0.0123)).toBe(3); // Multiple leading zeros
      expect(sigfigOf(0.00123)).toBe(3); // More leading zeros
      expect(sigfigOf("0.000456")).toBe(3); // Many leading zeros
      expect(sigfigOf(0.1)).toBe(1); // Single leading zero
    });
  });

  describe("Rule 4: Trailing zeros after a decimal point are significant", () => {
    test("counts trailing zeros after decimal point", () => {
      expect(sigfigOf("1.230")).toBe(4); // One trailing zero
      expect(sigfigOf("1.200")).toBe(4); // Two trailing zeros
      expect(sigfigOf("1.0")).toBe(2); // One trailing zero
      expect(sigfigOf("10.0")).toBe(3); // Trailing zero after decimal
      expect(sigfigOf("10.00")).toBe(4); // Two trailing zeros
      expect(sigfigOf("123.4500")).toBe(7); // Multiple trailing zeros (1,2,3,4,5,0,0)
    });
  });

  describe("Rule 5: Trailing zeros in a whole number without a decimal point are not significant", () => {
    test("does not count trailing zeros in whole numbers", () => {
      expect(sigfigOf(100)).toBe(1); // Two trailing zeros
      expect(sigfigOf(1000)).toBe(1); // Three trailing zeros
      expect(sigfigOf(1200)).toBe(2); // Two trailing zeros, 12 is significant
      expect(sigfigOf(150)).toBe(2); // One trailing zero
      expect(sigfigOf("500")).toBe(1); // Two trailing zeros
      expect(sigfigOf(10000)).toBe(1); // Four trailing zeros
    });

    test("counts trailing zeros when decimal point is present", () => {
      expect(sigfigOf("100.")).toBe(3); // Decimal point makes trailing zeros significant
      expect(sigfigOf("1000.")).toBe(4);
      expect(sigfigOf("150.")).toBe(3);
    });
  });

  describe("Rule 6: In scientific notation, all digits in the coefficient are significant", () => {
    test("counts all digits in scientific notation coefficient", () => {
      expect(sigfigOf("1.23e4")).toBe(3);
      expect(sigfigOf("1.230E-4")).toBe(4); // Trailing zero in coefficient
      expect(sigfigOf("2.0e10")).toBe(2);
      expect(sigfigOf("5.00e-3")).toBe(3); // Trailing zeros in coefficient
      expect(sigfigOf("1.2345e6")).toBe(5);
    });
  });

  describe("Additional edge cases", () => {
    test("handles zero", () => {
      expect(sigfigOf(0)).toBe(1);
      expect(sigfigOf("0")).toBe(1);
      expect(sigfigOf("0.0")).toBe(1);
      expect(sigfigOf("0.00")).toBe(1);
    });

    test("handles negative numbers", () => {
      expect(sigfigOf(-123)).toBe(3);
      expect(sigfigOf("-1.23")).toBe(3);
      expect(sigfigOf(-100)).toBe(1);
      expect(sigfigOf("-0.00123")).toBe(3);
    });

    test("handles string inputs", () => {
      expect(sigfigOf("123")).toBe(3);
      expect(sigfigOf("1.23")).toBe(3);
      expect(sigfigOf("0.0123")).toBe(3);
    });
  });
});

describe("toSigfig", () => {
  describe("formats to specified significant figures", () => {
    test("rounds to fewer significant figures", () => {
      expect(toSigfig(123.456, 3)).toBe("123");
      expect(toSigfig(123.456, 4)).toBe("123.5");
      expect(toSigfig(123.456, 5)).toBe("123.46");
      expect(toSigfig(9876, 2)).toBe("9.9e+3"); // Big.js uses exponential for large numbers
      expect(toSigfig(9876, 3)).toBe("9.88e+3");
    });

    test("handles rounding up", () => {
      expect(toSigfig(1.999, 2)).toBe("2.0"); // Big.js preserves trailing zero
      expect(toSigfig(99.9, 2)).toBe("1.0e+2"); // Big.js uses exponential
      expect(toSigfig(999, 2)).toBe("1.0e+3"); // Big.js uses exponential
    });

    test("preserves trailing zeros after decimal when needed", () => {
      expect(toSigfig(1.0, 2)).toBe("1.0"); // Big.js preserves trailing zeros
      expect(toSigfig(10, 3)).toBe("10.0");
      expect(toSigfig(100, 4)).toBe("100.0");
    });

    test("uses scientific notation for very large numbers", () => {
      expect(toSigfig(1234567, 3)).toBe("1.23e+6");
      expect(toSigfig(9876543, 4)).toBe("9.877e+6");
      expect(toSigfig(1000000, 2)).toBe("1.0e+6");
    });

    test("uses fixed notation for small numbers", () => {
      expect(toSigfig(0.001234, 3)).toBe("0.00123"); // Big.js uses fixed notation
      expect(toSigfig(0.00009876, 2)).toBe("0.000099"); // Big.js uses fixed notation
      expect(toSigfig(0.0000001, 1)).toBe("1e-7"); // Very small uses exponential
    });

    test("uses regular notation for moderate numbers", () => {
      expect(toSigfig(123.456, 3)).toBe("123");
      expect(toSigfig(1.234, 3)).toBe("1.23");
      expect(toSigfig(0.1234, 3)).toBe("0.123");
    });
  });

  test("handles negative numbers", () => {
    expect(toSigfig(-123.456, 3)).toBe("-123");
    expect(toSigfig(-0.001234, 2)).toBe("-0.0012"); // Big.js uses fixed notation
    expect(toSigfig(-9876, 2)).toBe("-9.9e+3"); // Big.js uses exponential
  });

  test("handles zero", () => {
    expect(toSigfig(0, 1)).toBe("0");
    expect(toSigfig(0, 3)).toBe("0");
    expect(toSigfig(0, 5)).toBe("0");
  });

  test("throws error for invalid sigfig count", () => {
    expect(() => toSigfig(123, 0)).toThrow(
      "Number of significant figures must be a positive integer"
    );
    expect(() => toSigfig(123, -1)).toThrow(
      "Number of significant figures must be a positive integer"
    );
    expect(() => toSigfig(123, 2.5)).toThrow(
      "Number of significant figures must be a positive integer"
    );
    expect(() => toSigfig(123, -2.5)).toThrow(
      "Number of significant figures must be a positive integer"
    );
    expect(() => toSigfig(123, NaN)).toThrow(
      "Number of significant figures must be a positive integer"
    );
    expect(() => toSigfig(123, Infinity)).toThrow(
      "Number of significant figures must be a positive integer"
    );
  });
});

describe("getDecimalPlacesForAddOrSub", () => {
  test("determines decimal places based on least precise operand", () => {
    expect(getDecimalPlacesForAddOrSub([1.23, 4.5])).toBe(1); // 4.5 has 1 decimal place
    expect(getDecimalPlacesForAddOrSub([1.234, 2.56])).toBe(2); // 2.56 has 2 decimal places
    expect(getDecimalPlacesForAddOrSub([123, 4.5])).toBe(0); // 123 has no decimal places
  });

  test("handles whole numbers", () => {
    expect(getDecimalPlacesForAddOrSub([100, 200])).toBe(0); // Both whole numbers
    expect(getDecimalPlacesForAddOrSub([100, 200.5])).toBe(0); // One whole number limits precision
  });

  test("handles string inputs", () => {
    expect(getDecimalPlacesForAddOrSub(["1.23", "4.5"])).toBe(1);
    expect(getDecimalPlacesForAddOrSub(["1.234", 2.56])).toBe(2); // Mixed types
  });

  test("handles multiple operands", () => {
    expect(getDecimalPlacesForAddOrSub([1.234, 2.56, 3.7])).toBe(1); // 3.7 has 1 decimal place
    expect(getDecimalPlacesForAddOrSub([1.2345, 2.345, 3.45, 4.5])).toBe(1); // 4.5 is least precise
  });
});

describe("getSigfigForMulOrDiv", () => {
  test("determines minimum significant figures", () => {
    expect(getSigfigForMulOrDiv([1.23, 4.5])).toBe(2); // min(3, 2) = 2
    expect(getSigfigForMulOrDiv([1.234, 2.56, 7.8])).toBe(2); // min(4, 3, 2) = 2
  });

  test("handles whole numbers with trailing zeros", () => {
    expect(getSigfigForMulOrDiv([100, 200])).toBe(1); // Both have 1 sig fig
    expect(getSigfigForMulOrDiv([150, 250])).toBe(2); // Both have 2 sig figs
  });

  test("handles string inputs", () => {
    expect(getSigfigForMulOrDiv(["1.23", "4.5"])).toBe(2);
    expect(getSigfigForMulOrDiv(["100", "200"])).toBe(1);
    expect(getSigfigForMulOrDiv(["1.0", "2.00"])).toBe(2); // min(2, 3) = 2
  });

  test("handles multiple operands", () => {
    expect(getSigfigForMulOrDiv([1.234, 2.56, 7.8, 9])).toBe(1); // 9 has 1 sig fig
    expect(getSigfigForMulOrDiv([123.45, 67.89, 12.3])).toBe(3); // 12.3 has 3 sig figs
  });

  test("handles scientific notation", () => {
    expect(getSigfigForMulOrDiv(["1.23e4", "4.5"])).toBe(2); // min(3, 2) = 2
    expect(getSigfigForMulOrDiv(["1.230e-4", "2.0"])).toBe(2); // min(4, 2) = 2
  });
});
